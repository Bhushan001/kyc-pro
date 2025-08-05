package com.ekyc.authservice.service;

import com.ekyc.authservice.dto.AuthResponse;
import com.ekyc.authservice.dto.LoginRequest;
import com.ekyc.authservice.dto.SignupRequest;
import com.ekyc.authservice.entity.User;
import com.ekyc.authservice.repository.UserRepository;
import com.ekyc.authservice.util.JwtUtil;
import com.ekyc.common.dto.UserSyncRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository repo;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final UserServiceClient userServiceClient;
  private final KeycloakAuthService keycloakAuthService;

  public AuthResponse login(LoginRequest req) {
    try {
      log.info("Login attempt for email: {}", req.getEmail());
      
      // First try user service authentication
      try {
        if (userServiceClient.validateUserCredentials(req.getEmail(), req.getPassword())) {
          // Get user details from user service
          UserSyncRequest userSyncRequest = userServiceClient.findUserByEmail(req.getEmail());
          if (userSyncRequest != null) {
            String token = jwtUtil.generateToken(userSyncRequest);
            log.info("Login successful via user service for user: {}", req.getEmail());
            
            AuthResponse response = AuthResponse.builder()
              .token(token)
              .userId(userSyncRequest.getUserId())
              .email(userSyncRequest.getEmail())
              .firstname(userSyncRequest.getFirstName())
              .lastname(userSyncRequest.getLastName())
              .role(userSyncRequest.getRole())
              .tenantId(userSyncRequest.getTenantId())
              .build();
            
            // Set additional user profile information
            response.setKeycloakId(userSyncRequest.getKeycloakId());
            response.setStatus(userSyncRequest.getStatus());
            response.setDateOfBirth(userSyncRequest.getDateOfBirth());
            response.setCountry(userSyncRequest.getCountry());
            response.setPhone(userSyncRequest.getPhone());
            
            log.info("AuthResponse created via user service: token={}, userId={}, email={}, role={}", 
              token != null ? "present" : "null", 
              userSyncRequest.getUserId(), 
              userSyncRequest.getEmail(), 
              userSyncRequest.getRole());
            
            return response;
          }
        }
      } catch (Exception e) {
        log.warn("User service authentication failed, trying Keycloak: {}", e.getMessage());
      }
      
      // Fallback to Keycloak authentication
      log.info("Trying Keycloak authentication for user: {}", req.getEmail());
      AuthResponse keycloakResponse = keycloakAuthService.authenticateWithKeycloak(req.getEmail(), req.getPassword());
      log.info("Login successful via Keycloak for user: {}", req.getEmail());
      return keycloakResponse;
      
    } catch (Exception e) {
      log.error("Login error for email {}: {}", req.getEmail(), e.getMessage(), e);
      throw new RuntimeException("Login failed: " + e.getMessage());
    }
  }
  
  public AuthResponse getUserProfile(String email) {
    try {
      log.info("Getting user profile for email: {}", email);
      
      // Get user details from user service
      UserSyncRequest userSyncRequest = userServiceClient.findUserByEmail(email);
      if (userSyncRequest != null) {
        String token = jwtUtil.generateToken(userSyncRequest);
        log.info("Profile retrieved successfully for user: {}", email);
        
        AuthResponse response = AuthResponse.builder()
          .token(token)
          .userId(userSyncRequest.getUserId())
          .email(userSyncRequest.getEmail())
          .firstname(userSyncRequest.getFirstName())
          .lastname(userSyncRequest.getLastName())
          .role(userSyncRequest.getRole())
          .tenantId(userSyncRequest.getTenantId())
          .build();
        
        // Set additional user profile information
        response.setKeycloakId(userSyncRequest.getKeycloakId());
        response.setStatus(userSyncRequest.getStatus());
        response.setDateOfBirth(userSyncRequest.getDateOfBirth());
        response.setCountry(userSyncRequest.getCountry());
        response.setPhone(userSyncRequest.getPhone());
        
        return response;
      } else {
        log.error("User not found for email: {}", email);
        throw new RuntimeException("User not found");
      }
      
    } catch (Exception e) {
      log.error("Error getting user profile for email {}: {}", email, e.getMessage(), e);
      throw new RuntimeException("Failed to get user profile: " + e.getMessage());
    }
  }

  public AuthResponse signup(SignupRequest req) {
    // Note: User existence check is handled by user-service

    // Validate terms acceptance
    if (!"true".equals(req.getTermsAccepted())) {
      throw new RuntimeException("Terms and conditions must be accepted");
    }

    // Create user via user service (which handles both database and Keycloak)
    UserSyncRequest userSyncRequest = new UserSyncRequest();
    userSyncRequest.setEmail(req.getEmail());
    userSyncRequest.setFirstName(req.getFirstname());
    userSyncRequest.setLastName(req.getLastname());
    userSyncRequest.setDateOfBirth(req.getDateOfBirth().toString());
    userSyncRequest.setCountry(req.getCountry());
    userSyncRequest.setRole(req.getRole());
    // Store plain password for user service, hash will be done by user service
    userSyncRequest.setPasswordHash(req.getPassword());
    
    // Set tenant_id based on role
    if ("PLATFORM_ADMIN".equals(req.getRole())) {
      userSyncRequest.setTenantId(null); // Platform admin doesn't belong to a specific tenant
    } else {
      // For demo purposes, assign to the demo tenant
      userSyncRequest.setTenantId(UUID.fromString("22222222-2222-2222-2222-222222222222"));
    }

    try {
      // Create user via user service (handles both database and Keycloak sync)
      UserSyncRequest createdUser = userServiceClient.createUser(userSyncRequest);
      
      if (createdUser != null) {
        log.info("User successfully created via user service: {}", req.getEmail());
        
        // Note: We don't create a local copy in auth-service anymore since user-service handles database storage
        // The user-service is the authoritative source for user data
        
        String token = jwtUtil.generateToken(createdUser);
        AuthResponse response = AuthResponse.builder()
          .token(token)
          .userId(createdUser.getUserId())
          .email(createdUser.getEmail())
          .firstname(createdUser.getFirstName())
          .lastname(createdUser.getLastName())
          .role(createdUser.getRole())
          .tenantId(createdUser.getTenantId())
          .build();
        
        // Set additional user profile information
        response.setKeycloakId(createdUser.getKeycloakId());
        response.setStatus(createdUser.getStatus());
        response.setDateOfBirth(createdUser.getDateOfBirth());
        response.setCountry(createdUser.getCountry());
        response.setPhone(createdUser.getPhone());
        
        return response;
      } else {
        throw new RuntimeException("Failed to create user via user service");
      }
      
    } catch (Exception e) {
      log.error("Error creating user via user service: {}", e.getMessage(), e);
      throw new RuntimeException("Failed to create user: " + e.getMessage());
    }
  }
}
