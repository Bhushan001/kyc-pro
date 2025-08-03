package com.ekyc.userservice.service;

import com.ekyc.common.dto.UserSyncRequest;
import java.util.UUID;

/**
 * Service interface for Keycloak user operations
 */
public interface KeycloakUserService {
    
    /**
     * Create a new user in Keycloak
     */
    UserSyncRequest createUser(UserSyncRequest request);
    
    /**
     * Create a social user in Keycloak
     */
    UserSyncRequest createSocialUser(UserSyncRequest request);
    
    /**
     * Find user by email
     */
    UserSyncRequest findByEmail(String email);
    
    /**
     * Find user by social provider and social user ID
     */
    UserSyncRequest findBySocialProvider(String socialProvider, String socialUserId);
    
    /**
     * Find user by ID
     */
    UserSyncRequest findById(String keycloakUserId);
    
    /**
     * Update user information
     */
    UserSyncRequest updateUser(UserSyncRequest request);
    
    /**
     * Update application user ID in Keycloak
     */
    void updateAppUserId(String keycloakUserId, UUID appUserId);
    
    /**
     * Validate password for a user
     */
    boolean validatePassword(UserSyncRequest user, String password);
    
    /**
     * Delete user from Keycloak
     */
    void deleteUser(String keycloakUserId);
    
    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if user exists by ID
     */
    boolean existsById(String keycloakUserId);
    
    /**
     * Assign role to user
     */
    void assignRole(String keycloakUserId, String role);
    
    /**
     * Remove role from user
     */
    void removeRole(String keycloakUserId, String role);
} 