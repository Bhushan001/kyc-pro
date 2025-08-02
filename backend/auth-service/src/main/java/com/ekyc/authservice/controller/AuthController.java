package com.ekyc.authservice.controller;

import com.ekyc.authservice.dto.AuthResponse;
import com.ekyc.authservice.dto.LoginRequest;
import com.ekyc.authservice.dto.SignupRequest;
import com.ekyc.authservice.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
  private final AuthService service;
  public AuthController(AuthService service) { this.service = service; }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
    try {
      return ResponseEntity.ok(service.login(req));
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PostMapping("/signup")
  public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest req) {
    try {
      return ResponseEntity.ok(service.signup(req));
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }
}
