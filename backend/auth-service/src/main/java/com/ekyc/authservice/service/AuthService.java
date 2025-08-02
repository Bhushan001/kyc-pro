package com.ekyc.authservice.service;

import com.ekyc.authservice.dto.AuthResponse;
import com.ekyc.authservice.dto.LoginRequest;
import com.ekyc.authservice.dto.SignupRequest;
import com.ekyc.authservice.entity.User;
import com.ekyc.authservice.repository.UserRepository;
import com.ekyc.authservice.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class AuthService {
  private final UserRepository repo;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  public AuthService(UserRepository repo, PasswordEncoder enc, JwtUtil jwt) {
    this.repo = repo;
    this.passwordEncoder = enc;
    this.jwtUtil = jwt;
  }

  public AuthResponse login(LoginRequest req) {
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

    // Create new user
    User user = new User();
    user.setEmail(req.getEmail());
    user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
    user.setFirstname(req.getFirstname());
    user.setLastname(req.getLastname());
    user.setDateOfBirth(req.getDateOfBirth().toString());
    user.setCountry(req.getCountry());
    user.setRole(req.getRole());
    
    // For now, set tenant_id to null for platform_admin, or create a default tenant for others
    // In a real implementation, you might want to create a tenant for tenant_admin and user roles
    if ("platform_admin".equals(req.getRole())) {
      user.setTenantId(null); // Platform admin doesn't belong to a specific tenant
    } else {
      // For demo purposes, assign to the demo tenant
      user.setTenantId(UUID.fromString("22222222-2222-2222-2222-222222222222"));
    }

    user = repo.save(user);

    String token = jwtUtil.generateToken(user);
    return new AuthResponse(token, user.getId(), user.getEmail(), user.getFirstname(), user.getLastname(), user.getRole(), user.getTenantId());
  }
}
