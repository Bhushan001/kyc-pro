package com.ekyc.userservice.service;

import com.ekyc.common.dto.UserSyncRequest;
import java.util.UUID;

/**
 * Service interface for database user operations
 */
public interface DatabaseUserService {
    
    /**
     * Create a new user in the database
     */
    UserSyncRequest createUser(UserSyncRequest request);
    
    /**
     * Create a social user in the database (from Keycloak)
     */
    UserSyncRequest createSocialUser(UserSyncRequest request);
    
    /**
     * Find user by email
     */
    UserSyncRequest findByEmail(String email);
    
    /**
     * Find user by ID
     */
    UserSyncRequest findById(UUID userId);
    
    /**
     * Update user information
     */
    UserSyncRequest updateUser(UserSyncRequest request);
    
    /**
     * Update Keycloak ID for a user
     */
    void updateKeycloakId(UUID userId, String keycloakId);
    
    /**
     * Validate password for a user
     */
    boolean validatePassword(UserSyncRequest user, String password);
    
    /**
     * Delete user from database
     */
    void deleteUser(UUID userId);
    
    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if user exists by ID
     */
    boolean existsById(UUID userId);
} 