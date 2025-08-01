package com.saasplatform.userservice.controller;

import com.saasplatform.userservice.dto.CreateUserRequest;
import com.saasplatform.userservice.dto.UserDto;
import com.saasplatform.userservice.service.UserService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<UserDto>> getUsersByTenant(@PathVariable UUID tenantId) {
        List<UserDto> users = service.getUsersByTenant(tenantId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {
        UserDto user = service.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto created = service.createUser(request);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        service.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
}
