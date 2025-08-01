package com.saasplatform.authservice.controller;

import com.saasplatform.authservice.dto.AuthResponse;
import com.saasplatform.authservice.dto.LoginRequest;
import com.saasplatform.authservice.service.AuthService;
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
}
