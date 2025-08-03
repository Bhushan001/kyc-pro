package com.ekyc.userservice.service;

import com.ekyc.common.dto.UserSyncRequest;
import com.ekyc.common.exception.SaaSPlatformException;
import com.ekyc.common.constants.MessageCodes;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Unified user management service that handles both application and social signup
 * with proper synchronization between database and Keycloak
 */
@Service
public class UnifiedUserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UnifiedUserService.class);
    
    private final DatabaseUserService databaseUserService;
    private final KeycloakUserService keycloakUserService;
    private final UserSyncService userSyncService;
    
    public UnifiedUserService(DatabaseUserService databaseUserService, 
                            KeycloakUserService keycloakUserService,
                            UserSyncService userSyncService) {
        this.databaseUserService = databaseUserService;
        this.keycloakUserService = keycloakUserService;
        this.userSyncService = userSyncService;
    }
    
    /**
     * Handle application signup (Database first, then Keycloak)
     */
    @Transactional
    public UserSyncRequest handleApplicationSignup(UserSyncRequest request) {
        try {
            // Set sync metadata
            request.setSyncSource("APPLICATION");
            request.setSyncDirection("DB_TO_KEYCLOAK");
            request.setCreatedAt(OffsetDateTime.now());
            request.setUpdatedAt(OffsetDateTime.now());
            
            // Step 1: Create user in database
            UserSyncRequest dbUser = databaseUserService.createUser(request);
            
            // Step 2: Sync to Keycloak
            UserSyncRequest keycloakUser = keycloakUserService.createUser(dbUser);
            
            // Step 3: Update database with Keycloak ID
            if (keycloakUser.getUserId() != null) {
                databaseUserService.updateKeycloakId(dbUser.getUserId(), keycloakUser.getUserId().toString());
            }
            
            return dbUser;
            
        } catch (Exception e) {
            // Rollback database creation if Keycloak sync fails
            if (request.getUserId() != null) {
                databaseUserService.deleteUser(request.getUserId());
            }
            throw new SaaSPlatformException(MessageCodes.ERROR_USER_CREATION_FAILED, 
                "Failed to create user: " + e.getMessage());
        }
    }
    
    /**
     * Handle social signup (Keycloak first, then Database)
     */
    @Transactional
    public UserSyncRequest handleSocialSignup(UserSyncRequest request) {
        try {
            // Set sync metadata
            request.setSyncSource("SOCIAL");
            request.setSyncDirection("KEYCLOAK_TO_DB");
            request.setCreatedAt(OffsetDateTime.now());
            request.setUpdatedAt(OffsetDateTime.now());
            request.setEmailVerified(true); // Social providers verify email
            
            // Step 1: Create user in Keycloak
            UserSyncRequest keycloakUser = keycloakUserService.createSocialUser(request);
            
            // Step 2: Sync to database
            UserSyncRequest dbUser = databaseUserService.createSocialUser(keycloakUser);
            
            // Step 3: Update Keycloak with database ID
            if (dbUser.getUserId() != null) {
                keycloakUserService.updateAppUserId(keycloakUser.getUserId().toString(), dbUser.getUserId());
            }
            
            return dbUser;
            
        } catch (Exception e) {
            // Rollback Keycloak creation if database sync fails
            if (request.getUserId() != null) {
                keycloakUserService.deleteUser(request.getUserId().toString());
            }
            throw new SaaSPlatformException(MessageCodes.ERROR_USER_CREATION_FAILED, 
                "Failed to create social user: " + e.getMessage());
        }
    }
    
    /**
     * Handle user login (check both database and Keycloak)
     */
    public UserSyncRequest handleUserLogin(String email, String password) {
        // First check database
        UserSyncRequest dbUser = databaseUserService.findByEmail(email);
        if (dbUser != null && databaseUserService.validatePassword(dbUser, password)) {
            return dbUser;
        }
        
        // Then check Keycloak
        UserSyncRequest keycloakUser = keycloakUserService.findByEmail(email);
        if (keycloakUser != null && keycloakUserService.validatePassword(keycloakUser, password)) {
            return keycloakUser;
        }
        
        throw new SaaSPlatformException(MessageCodes.ERROR_INVALID_CREDENTIALS);
    }
    
    /**
     * Handle social login
     */
    public UserSyncRequest handleSocialLogin(String socialProvider, String socialUserId) {
        // Check if user exists in Keycloak
        UserSyncRequest keycloakUser = keycloakUserService.findBySocialProvider(socialProvider, socialUserId);
        if (keycloakUser != null) {
            // Check if user exists in database
            UserSyncRequest dbUser = databaseUserService.findByEmail(keycloakUser.getEmail());
            if (dbUser == null) {
                // Sync from Keycloak to database
                return handleSocialSignup(keycloakUser);
            }
            return dbUser;
        }
        
        throw new SaaSPlatformException(MessageCodes.ERROR_USER_NOT_FOUND);
    }
    
    /**
     * Update user information
     */
    @Transactional
    public UserSyncRequest updateUser(UserSyncRequest request) {
        // Update in database
        UserSyncRequest updatedDbUser = databaseUserService.updateUser(request);
        
        // Update in Keycloak
        UserSyncRequest updatedKeycloakUser = keycloakUserService.updateUser(request);
        
        return updatedDbUser;
    }
    
    /**
     * Delete user from both systems by ID
     */
    @Transactional
    public void deleteUser(UUID userId) {
        try {
            // First, try to get user info to get Keycloak ID
            UserSyncRequest dbUser = databaseUserService.findById(userId);
            String keycloakId = null;
            
            if (dbUser != null && dbUser.getKeycloakId() != null) {
                keycloakId = dbUser.getKeycloakId();
            } else {
                // Try to find user in Keycloak by email
                if (dbUser != null) {
                    UserSyncRequest keycloakUser = keycloakUserService.findByEmail(dbUser.getEmail());
                    if (keycloakUser != null) {
                        keycloakId = keycloakUser.getUserId().toString();
                    }
                }
            }
            
            // Delete from database first
            try {
                databaseUserService.deleteUser(userId);
                logger.info("Successfully deleted user {} from database", userId);
            } catch (Exception e) {
                logger.warn("Failed to delete user {} from database: {}", userId, e.getMessage());
                // Continue with Keycloak deletion even if database deletion fails
            }
            
            // Delete from Keycloak
            if (keycloakId != null) {
                try {
                    keycloakUserService.deleteUser(keycloakId);
                    logger.info("Successfully deleted user {} from Keycloak", keycloakId);
                } catch (Exception e) {
                    logger.warn("Failed to delete user {} from Keycloak: {}", keycloakId, e.getMessage());
                    // Don't throw exception, consider partial deletion acceptable
                }
            } else {
                logger.warn("No Keycloak ID found for user {}, skipping Keycloak deletion", userId);
            }
            
        } catch (Exception e) {
            logger.error("Error during user deletion process for user {}: {}", userId, e.getMessage(), e);
            throw new SaaSPlatformException(MessageCodes.ERROR_USER_DELETION_FAILED, 
                "Failed to delete user: " + e.getMessage());
        }
    }
    
    /**
     * Delete user from both systems by email
     */
    @Transactional
    public void deleteUserByEmail(String email) {
        try {
            // Find user in database
            UserSyncRequest dbUser = databaseUserService.findByEmail(email);
            String keycloakId = null;
            UUID userId = null;
            
            if (dbUser != null) {
                userId = dbUser.getUserId();
                if (dbUser.getKeycloakId() != null) {
                    keycloakId = dbUser.getKeycloakId();
                }
            }
            
            // Find user in Keycloak if not found in database
            if (keycloakId == null) {
                UserSyncRequest keycloakUser = keycloakUserService.findByEmail(email);
                if (keycloakUser != null) {
                    keycloakId = keycloakUser.getUserId().toString();
                }
            }
            
            // Delete from database
            if (userId != null) {
                try {
                    databaseUserService.deleteUser(userId);
                    logger.info("Successfully deleted user {} from database", userId);
                } catch (Exception e) {
                    logger.warn("Failed to delete user {} from database: {}", userId, e.getMessage());
                }
            }
            
            // Delete from Keycloak
            if (keycloakId != null) {
                try {
                    keycloakUserService.deleteUser(keycloakId);
                    logger.info("Successfully deleted user {} from Keycloak", keycloakId);
                } catch (Exception e) {
                    logger.warn("Failed to delete user {} from Keycloak: {}", keycloakId, e.getMessage());
                }
            }
            
            if (userId == null && keycloakId == null) {
                logger.warn("User with email {} not found in either system", email);
            }
            
        } catch (Exception e) {
            logger.error("Error during user deletion process for email {}: {}", email, e.getMessage(), e);
            throw new SaaSPlatformException(MessageCodes.ERROR_USER_DELETION_FAILED, 
                "Failed to delete user: " + e.getMessage());
        }
    }
    
    /**
     * Check if user exists in either system by email
     */
    public boolean userExists(String email) {
        return databaseUserService.findByEmail(email) != null || 
               keycloakUserService.findByEmail(email) != null;
    }
    
    /**
     * Check if user exists in either system by ID
     */
    public boolean userExistsById(UUID userId) {
        return databaseUserService.existsById(userId) || 
               keycloakUserService.existsById(userId.toString());
    }
    
    /**
     * Sync user between systems (for data consistency)
     */
    @Transactional
    public UserSyncRequest syncUser(String email) {
        UserSyncRequest dbUser = databaseUserService.findByEmail(email);
        UserSyncRequest keycloakUser = keycloakUserService.findByEmail(email);
        
        if (dbUser != null && keycloakUser == null) {
            // User exists in DB but not in Keycloak
            return handleApplicationSignup(dbUser);
        } else if (dbUser == null && keycloakUser != null) {
            // User exists in Keycloak but not in DB
            return handleSocialSignup(keycloakUser);
        } else if (dbUser != null && keycloakUser != null) {
            // User exists in both, sync data
            return userSyncService.syncUserData(dbUser, keycloakUser);
        }
        
        throw new SaaSPlatformException(MessageCodes.ERROR_USER_NOT_FOUND);
    }
} 