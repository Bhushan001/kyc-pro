package com.ekyc.keycloaksyncservice.controller;

import com.ekyc.keycloaksyncservice.dto.SyncRequest;
import com.ekyc.keycloaksyncservice.dto.SyncResponse;
import com.ekyc.keycloaksyncservice.service.KeycloakSyncService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/keycloak-sync")
public class KeycloakSyncController {

    @Autowired
    private KeycloakSyncService syncService;

    @PostMapping("/users/sync")
    public ResponseEntity<SyncResponse> syncUser(@Valid @RequestBody SyncRequest request) {
        SyncResponse response = syncService.syncUser(request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/users/{email}")
    public ResponseEntity<SyncResponse> deleteUser(@PathVariable String email) {
        SyncResponse response = syncService.deleteUser(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/roles/sync")
    public ResponseEntity<SyncResponse> syncRole(@RequestParam String roleName, 
                                               @RequestParam String description) {
        SyncResponse response = syncService.syncRole(roleName, description);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Keycloak Sync Service is running");
    }
} 