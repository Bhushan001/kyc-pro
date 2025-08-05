package com.ekyc.userservice.controller;

import com.ekyc.userservice.dto.CreateUserRequest;
import com.ekyc.userservice.dto.UserDto;
import com.ekyc.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@Slf4j
@RequiredArgsConstructor
public class UserController {
  private final UserService service;

  @PostMapping
  public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest req) {
    return ResponseEntity.ok(service.createUser(req));
  }

  @GetMapping("/tenant/{tenantId}")
  public ResponseEntity<List<UserDto>> getUsersByTenant(@PathVariable UUID tenantId) {
    return ResponseEntity.ok(service.getUsersByTenant(tenantId));
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {
    return ResponseEntity.ok(service.getUserById(id));
  }
}
