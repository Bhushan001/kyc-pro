package com.ekyc.authservice.controller;

import com.ekyc.authservice.dto.AuthResponse;
import com.ekyc.authservice.dto.LoginRequest;
import com.ekyc.authservice.dto.SignupRequest;
import com.ekyc.authservice.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService service;
  private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
  
  public AuthController(AuthService service) { this.service = service; }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
    try {
      return ResponseEntity.ok(service.login(req));
    } catch (Exception e) {
      logger.error("Login error: ", e);
      return ResponseEntity.badRequest().build();
    }
  }

  @PostMapping("/signup")
  public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest req) {
    try {
      logger.info("Signup request received for email: {}", req.getEmail());
      return ResponseEntity.ok(service.signup(req));
    } catch (Exception e) {
      logger.error("Signup error: ", e);
      return ResponseEntity.badRequest().build();
    }
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
    logger.error("Validation error: {}", ex.getMessage());
    return ResponseEntity.badRequest().body("Validation failed: " + ex.getMessage());
  }
}
