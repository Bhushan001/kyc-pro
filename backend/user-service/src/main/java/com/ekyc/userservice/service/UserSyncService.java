package com.ekyc.userservice.service;

import com.ekyc.common.dto.UserSyncRequest;

/**
 * Service interface for user data synchronization between database and Keycloak
 */
public interface UserSyncService {
    
    /**
     * Sync user data between database and Keycloak
     */
    UserSyncRequest syncUserData(UserSyncRequest dbUser, UserSyncRequest keycloakUser);
    
    /**
     * Sync user from database to Keycloak
     */
    UserSyncRequest syncDbToKeycloak(UserSyncRequest dbUser);
    
    /**
     * Sync user from Keycloak to database
     */
    UserSyncRequest syncKeycloakToDb(UserSyncRequest keycloakUser);
    
    /**
     * Validate user data consistency between systems
     */
    boolean validateUserConsistency(UserSyncRequest dbUser, UserSyncRequest keycloakUser);
    
    /**
     * Merge user data from both systems
     */
    UserSyncRequest mergeUserData(UserSyncRequest dbUser, UserSyncRequest keycloakUser);
    
    /**
     * Resolve conflicts between database and Keycloak user data
     */
    UserSyncRequest resolveConflicts(UserSyncRequest dbUser, UserSyncRequest keycloakUser);
} 