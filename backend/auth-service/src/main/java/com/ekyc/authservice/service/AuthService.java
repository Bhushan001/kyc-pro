package com.ekyc.authservice.service;

import com.ekyc.authservice.dto.AuthResponse;
import com.ekyc.authservice.dto.LoginRequest;
import com.ekyc.authservice.dto.SignupRequest;
import com.ekyc.authservice.entity.User;
import com.ekyc.authservice.repository.UserRepository;
import com.ekyc.authservice.util.JwtUtil;
import com.ekyc.common.dto.UserSyncRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class AuthService {
  private final UserRepository repo;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final UserServiceClient userServiceClient;
  private final KeycloakAuthService keycloakAuthService;
  private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

  public AuthService(UserRepository repo, PasswordEncoder enc, JwtUtil jwt, UserServiceClient userServiceClient, KeycloakAuthService keycloakAuthService) {
    this.repo = repo;
    this.passwordEncoder = enc;
    this.jwtUtil = jwt;
    this.userServiceClient = userServiceClient;
    this.keycloakAuthService = keycloakAuthService;
  }

  public AuthResponse login(LoginRequest req) {
    try {
      logger.info("Login attempt for email: {}", req.getEmail());
      
      // First try user service authentication
      try {
        if (userServiceClient.validateUserCredentials(req.getEmail(), req.getPassword())) {
          // Get user details from user service
          UserSyncRequest userSyncRequest = userServiceClient.findUserByEmail(req.getEmail());
          if (userSyncRequest != null) {
            String token = jwtUtil.generateToken(userSyncRequest);
            logger.info("Login successful via user service for user: {}", req.getEmail());
            
            AuthResponse response = new AuthResponse(
              token, 
              userSyncRequest.getUserId(), 
              userSyncRequest.getEmail(), 
              userSyncRequest.getFirstName(), 
              userSyncRequest.getLastName(), 
              userSyncRequest.getRole(), 
              userSyncRequest.getTenantId()
            );
            
            // Set additional user profile information
            response.setKeycloakId(userSyncRequest.getKeycloakId());
            response.setStatus(userSyncRequest.getStatus());
            response.setDateOfBirth(userSyncRequest.getDateOfBirth());
            response.setCountry(userSyncRequest.getCountry());
            response.setPhone(userSyncRequest.getPhone());
            
            logger.info("AuthResponse created via user service: token={}, userId={}, email={}, role={}", 
              token != null ? "present" : "null", 
              userSyncRequest.getUserId(), 
              userSyncRequest.getEmail(), 
              userSyncRequest.getRole());
            
            return response;
          }
        }
      } catch (Exception e) {
        logger.warn("User service authentication failed, trying Keycloak: {}", e.getMessage());
      }
      
      // Fallback to Keycloak authentication
      logger.info("Trying Keycloak authentication for user: {}", req.getEmail());
      AuthResponse keycloakResponse = keycloakAuthService.authenticateWithKeycloak(req.getEmail(), req.getPassword());
      logger.info("Login successful via Keycloak for user: {}", req.getEmail());
      return keycloakResponse;
      
    } catch (Exception e) {
      logger.error("Login error for email {}: {}", req.getEmail(), e.getMessage(), e);
      throw new RuntimeException("Login failed: " + e.getMessage());
    }
  }
  
  public AuthResponse getUserProfile(String email) {
    try {
      logger.info("Getting user profile for email: {}", email);
      
      // Get user details from user service
      UserSyncRequest userSyncRequest = userServiceClient.findUserByEmail(email);
      if (userSyncRequest != null) {
        String token = jwtUtil.generateToken(userSyncRequest);
        logger.info("Profile retrieved successfully for user: {}", email);
        
        AuthResponse response = new AuthResponse(
          token, 
          userSyncRequest.getUserId(), 
          userSyncRequest.getEmail(), 
          userSyncRequest.getFirstName(), 
          userSyncRequest.getLastName(), 
          userSyncRequest.getRole(), 
          userSyncRequest.getTenantId()
        );
        
        // Set additional user profile information
        response.setKeycloakId(userSyncRequest.getKeycloakId());
        response.setStatus(userSyncRequest.getStatus());
        response.setDateOfBirth(userSyncRequest.getDateOfBirth());
        response.setCountry(userSyncRequest.getCountry());
        response.setPhone(userSyncRequest.getPhone());
        
        return response;
      } else {
        logger.error("User not found for email: {}", email);
        throw new RuntimeException("User not found");
      }
      
    } catch (Exception e) {
      logger.error("Error getting user profile for email {}: {}", email, e.getMessage(), e);
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
        logger.info("User successfully created via user service: {}", req.getEmail());
        
        // Note: We don't create a local copy in auth-service anymore since user-service handles database storage
        // The user-service is the authoritative source for user data
        
        String token = jwtUtil.generateToken(createdUser);
        AuthResponse response = new AuthResponse(token, createdUser.getUserId(), createdUser.getEmail(), 
                              createdUser.getFirstName(), createdUser.getLastName(), 
                              createdUser.getRole(), createdUser.getTenantId());
        
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
      logger.error("Error creating user via user service: {}", e.getMessage(), e);
      throw new RuntimeException("Failed to create user: " + e.getMessage());
    }
  }
}
