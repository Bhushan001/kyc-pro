package com.ekyc.userservice.controller;

import com.ekyc.common.dto.UserSyncRequest;
import com.ekyc.userservice.service.UnifiedUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UnifiedUserController {
    
    private final UnifiedUserService unifiedUserService;
    
    public UnifiedUserController(UnifiedUserService unifiedUserService) {
        this.unifiedUserService = unifiedUserService;
    }
    
    @PostMapping("/signup")
    public ResponseEntity<UserSyncRequest> signup(@Valid @RequestBody UserSyncRequest request) {
        UserSyncRequest createdUser = unifiedUserService.handleApplicationSignup(request);
        return ResponseEntity.ok(createdUser);
    }
    
    @PostMapping("/social-signup")
    public ResponseEntity<UserSyncRequest> socialSignup(@Valid @RequestBody UserSyncRequest request) {
        UserSyncRequest createdUser = unifiedUserService.handleSocialSignup(request);
        return ResponseEntity.ok(createdUser);
    }
    
    @PostMapping("/login")
    public ResponseEntity<UserSyncRequest> login(@RequestParam String email, @RequestParam String password) {
        UserSyncRequest user = unifiedUserService.handleUserLogin(email, password);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/social-login")
    public ResponseEntity<UserSyncRequest> socialLogin(@RequestParam String socialProvider, 
                                                     @RequestParam String socialUserId) {
        UserSyncRequest user = unifiedUserService.handleSocialLogin(socialProvider, socialUserId);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<UserSyncRequest> getUserByEmail(@PathVariable String email) {
        // Check if user exists in either system
        if (unifiedUserService.userExists(email)) {
            // Try to sync user data
            UserSyncRequest user = unifiedUserService.syncUser(email);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/validate-credentials")
    public ResponseEntity<Boolean> validateCredentials(@RequestParam String email, @RequestParam String password) {
        try {
            UserSyncRequest user = unifiedUserService.handleUserLogin(email, password);
            return ResponseEntity.ok(user != null);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<UserSyncRequest> updateUser(@PathVariable UUID userId, 
                                                    @Valid @RequestBody UserSyncRequest request) {
        request.setUserId(userId);
        UserSyncRequest updatedUser = unifiedUserService.updateUser(request);
        return ResponseEntity.ok(updatedUser);
    }
    
    /**
     * Delete user by ID from both database and Keycloak
     * 
     * @param userId The UUID of the user to delete
     * @return 200 OK if successful, 404 if user not found, 500 if error
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
        try {
            // Check if user exists before deletion
            if (!unifiedUserService.userExistsById(userId)) {
                return ResponseEntity.notFound().build();
            }
            
            unifiedUserService.deleteUser(userId);
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            // Log the error but return a generic response
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Delete user by email from both database and Keycloak
     * 
     * @param email The email of the user to delete
     * @return 200 OK if successful, 404 if user not found, 500 if error
     */
    @DeleteMapping("/email/{email}")
    public ResponseEntity<Void> deleteUserByEmail(@PathVariable String email) {
        try {
            // Check if user exists before deletion
            if (!unifiedUserService.userExists(email)) {
                return ResponseEntity.notFound().build();
            }
            
            unifiedUserService.deleteUserByEmail(email);
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            // Log the error but return a generic response
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/sync/{email}")
    public ResponseEntity<UserSyncRequest> syncUser(@PathVariable String email) {
        UserSyncRequest syncedUser = unifiedUserService.syncUser(email);
        return ResponseEntity.ok(syncedUser);
    }
} 