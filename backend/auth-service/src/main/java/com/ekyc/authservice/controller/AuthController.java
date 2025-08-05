package com.ekyc.authservice.controller;

import com.ekyc.authservice.dto.AuthResponse;
import com.ekyc.authservice.dto.LoginRequest;
import com.ekyc.authservice.dto.SignupRequest;
import com.ekyc.authservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {
  private final AuthService service;

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
    try {
      log.info("Login request received for email: {}", req.getEmail());
      AuthResponse response = service.login(req);
      log.info("Login successful for email: {}", req.getEmail());
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Login error for email {}: {}", req.getEmail(), e.getMessage(), e);
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping("/test")
  public ResponseEntity<String> test() {
    log.info("Test endpoint called");
    return ResponseEntity.ok("Auth service is working!");
  }

  @PostMapping("/signup")
  public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest req) {
    try {
      log.info("Signup request received for email: {}", req.getEmail());
      return ResponseEntity.ok(service.signup(req));
    } catch (Exception e) {
      log.error("Signup error: ", e);
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping("/profile/{email}")
  public ResponseEntity<AuthResponse> getUserProfile(@PathVariable String email) {
    try {
      log.info("Profile request received for email: {}", email);
      AuthResponse response = service.getUserProfile(email);
      log.info("Profile retrieved successfully for email: {}", email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Profile error for email {}: {}", email, e.getMessage(), e);
      return ResponseEntity.notFound().build();
    }
  }
  
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
    log.error("Validation error: {}", ex.getMessage());
    return ResponseEntity.badRequest().body("Validation failed: " + ex.getMessage());
  }
}
