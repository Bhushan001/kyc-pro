package com.ekyc.keycloaksyncservice.controller;

import com.ekyc.common.dto.SyncResponse;
import com.ekyc.common.dto.UserSyncRequest;
import com.ekyc.keycloaksyncservice.service.KeycloakSyncService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/keycloak-sync")
@Slf4j
@RequiredArgsConstructor
public class KeycloakSyncController {

    private final KeycloakSyncService syncService;

    @PostMapping("/users/sync")
    public ResponseEntity<SyncResponse> syncUser(@Valid @RequestBody UserSyncRequest request) {
        SyncResponse response = syncService.syncUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/bulk-sync")
    public ResponseEntity<SyncResponse> bulkSyncUsers(@Valid @RequestBody List<UserSyncRequest> requests) {
        SyncResponse response = syncService.bulkSyncUsers(requests);
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

    @GetMapping("/users/{email}")
    public ResponseEntity<SyncResponse> getUser(@PathVariable String email) {
        SyncResponse response = syncService.getUser(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Keycloak Sync Service is running");
    }
} 