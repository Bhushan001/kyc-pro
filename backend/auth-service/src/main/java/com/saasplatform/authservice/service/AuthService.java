package com.saasplatform.authservice.service;

import com.saasplatform.authservice.dto.AuthResponse;
import com.saasplatform.authservice.dto.LoginRequest;
import com.saasplatform.authservice.entity.User;
import com.saasplatform.authservice.repository.UserRepository;
import com.saasplatform.authservice.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

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
    return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole(), user.getTenantId());
  }
}
