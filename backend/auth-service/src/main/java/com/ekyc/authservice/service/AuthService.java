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
  private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

  public AuthService(UserRepository repo, PasswordEncoder enc, JwtUtil jwt, UserServiceClient userServiceClient) {
    this.repo = repo;
    this.passwordEncoder = enc;
    this.jwtUtil = jwt;
    this.userServiceClient = userServiceClient;
  }

  public AuthResponse login(LoginRequest req) {
    // First try to validate via user service
    if (userServiceClient.validateUserCredentials(req.getEmail(), req.getPassword())) {
      // Get user details from user service
      UserSyncRequest userSyncRequest = userServiceClient.findUserByEmail(req.getEmail());
      if (userSyncRequest != null) {
        // Update last login in local database
        User localUser = repo.findByEmail(req.getEmail()).orElse(null);
        if (localUser != null) {
          localUser.setLastLogin(OffsetDateTime.now());
          repo.save(localUser);
        }
        
        String token = jwtUtil.generateToken(userSyncRequest);
        return new AuthResponse(token, userSyncRequest.getUserId(), userSyncRequest.getEmail(), 
                              userSyncRequest.getFirstName(), userSyncRequest.getLastName(), 
                              userSyncRequest.getRole(), userSyncRequest.getTenantId());
      }
    }
    
    // Fallback to local database check
    User user = repo.findByEmailAndStatus(req.getEmail(), "active")
        .orElseThrow(() -> new RuntimeException("User not found or inactive"));
    if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash()))
      throw new RuntimeException("Invalid credentials");

    user.setLastLogin(OffsetDateTime.now());
    repo.save(user);

    String token = jwtUtil.generateToken(user);
    return new AuthResponse(token, user.getId(), user.getEmail(), user.getFirstname(), user.getLastname(), user.getRole(), user.getTenantId());
  }

  public AuthResponse signup(SignupRequest req) {
    // Check if user already exists
    if (repo.findByEmail(req.getEmail()).isPresent()) {
      throw new RuntimeException("User with this email already exists");
    }

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
        
        // Also create a local copy for auth service
        User localUser = new User();
        localUser.setId(createdUser.getUserId());
        localUser.setEmail(createdUser.getEmail());
        localUser.setFirstname(createdUser.getFirstName());
        localUser.setLastname(createdUser.getLastName());
        localUser.setDateOfBirth(createdUser.getDateOfBirth());
        localUser.setCountry(createdUser.getCountry());
        localUser.setRole(createdUser.getRole());
        localUser.setTenantId(createdUser.getTenantId());
        localUser.setPasswordHash(""); // We don't store password in auth service
        localUser.setStatus("active");
        
        repo.save(localUser);
        
        String token = jwtUtil.generateToken(createdUser);
        return new AuthResponse(token, createdUser.getUserId(), createdUser.getEmail(), 
                              createdUser.getFirstName(), createdUser.getLastName(), 
                              createdUser.getRole(), createdUser.getTenantId());
      } else {
        throw new RuntimeException("Failed to create user via user service");
      }
      
    } catch (Exception e) {
      logger.error("Error creating user via user service: {}", e.getMessage(), e);
      throw new RuntimeException("Failed to create user: " + e.getMessage());
    }
  }
}
