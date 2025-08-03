package com.ekyc.keycloaksyncservice.service;

import com.ekyc.common.dto.SyncResponse;
import com.ekyc.common.dto.UserSyncRequest;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

import java.util.ArrayList;

@Service
public class KeycloakSyncService {

    @Autowired
    private Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public SyncResponse syncUser(UserSyncRequest request) {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();

            // Check if user already exists
            List<UserRepresentation> existingUsers = usersResource.search(request.getEmail());
            
            if (!existingUsers.isEmpty()) {
                // Update existing user
                UserRepresentation existingUser = existingUsers.get(0);
                updateUserInKeycloak(existingUser, request);
                usersResource.get(existingUser.getId()).update(existingUser);
                
                SyncResponse response = new SyncResponse(true, "User updated successfully");
                response.setKeycloakUserId(existingUser.getId());
                response.setData(Map.of("operation", "UPDATE", "userId", request.getUserId()));
                return response;
            } else {
                // Create new user
                UserRepresentation newUser = createUserRepresentation(request);
                var response = usersResource.create(newUser);
                
                if (response.getStatus() == 201) {
                    String userId = response.getLocation().getPath().substring(
                        response.getLocation().getPath().lastIndexOf('/') + 1);
                    
                    // Assign role to user
                    assignRoleToUser(userId, request.getRole());
                    
                    SyncResponse syncResponse = new SyncResponse(true, "User created successfully");
                    syncResponse.setKeycloakUserId(userId);
                    syncResponse.setData(Map.of("operation", "CREATE", "userId", request.getUserId()));
                    return syncResponse;
                } else {
                    return new SyncResponse(false, "Failed to create user in Keycloak");
                }
            }
        } catch (Exception e) {
            return new SyncResponse(false, "Error syncing user: " + e.getMessage());
        }
    }

    private UserRepresentation createUserRepresentation(UserSyncRequest request) {
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        // Set attributes
        Map<String, List<String>> attributes = new HashMap<>();
        if (request.getTenantId() != null) {
            attributes.put("tenantId", Arrays.asList(request.getTenantId().toString()));
        }
        if (request.getTenantName() != null) {
            attributes.put("tenantName", Arrays.asList(request.getTenantName()));
        }
        if (request.getUserId() != null) {
            attributes.put("appUserId", Arrays.asList(request.getUserId().toString()));
        }
        if (request.getPhone() != null) {
            attributes.put("phone", Arrays.asList(request.getPhone()));
        }
        if (request.getCountry() != null) {
            attributes.put("country", Arrays.asList(request.getCountry()));
        }
        if (request.getDateOfBirth() != null) {
            attributes.put("dateOfBirth", Arrays.asList(request.getDateOfBirth()));
        }
        if (request.getSocialProvider() != null) {
            attributes.put("socialProvider", Arrays.asList(request.getSocialProvider()));
        }
        if (request.getSocialUserId() != null) {
            attributes.put("socialUserId", Arrays.asList(request.getSocialUserId()));
        }
        user.setAttributes(attributes);
        
        // Note: Credentials will be set by Keycloak admin or user will set password on first login
        // For now, we'll create users without credentials and let them set password on first login
        
        return user;
    }

    private void updateUserInKeycloak(UserRepresentation user, UserSyncRequest request) {
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        
        // Update attributes
        Map<String, List<String>> attributes = new HashMap<>();
        if (request.getTenantId() != null) {
            attributes.put("tenantId", Arrays.asList(request.getTenantId().toString()));
        }
        if (request.getTenantName() != null) {
            attributes.put("tenantName", Arrays.asList(request.getTenantName()));
        }
        if (request.getUserId() != null) {
            attributes.put("appUserId", Arrays.asList(request.getUserId().toString()));
        }
        if (request.getPhone() != null) {
            attributes.put("phone", Arrays.asList(request.getPhone()));
        }
        if (request.getCountry() != null) {
            attributes.put("country", Arrays.asList(request.getCountry()));
        }
        if (request.getDateOfBirth() != null) {
            attributes.put("dateOfBirth", Arrays.asList(request.getDateOfBirth()));
        }
        if (request.getSocialProvider() != null) {
            attributes.put("socialProvider", Arrays.asList(request.getSocialProvider()));
        }
        if (request.getSocialUserId() != null) {
            attributes.put("socialUserId", Arrays.asList(request.getSocialUserId()));
        }
        user.setAttributes(attributes);
    }

    private void assignRoleToUser(String userId, String role) {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            var rolesResource = realmResource.roles();
            var userRolesResource = realmResource.users().get(userId).roles().realmLevel();
            
            // Get the role
            var roleRepresentation = rolesResource.get(role).toRepresentation();
            
            // Assign role to user
            userRolesResource.add(Arrays.asList(roleRepresentation));
        } catch (Exception e) {
            // Log error but don't fail the sync
            System.err.println("Error assigning role to user: " + e.getMessage());
        }
    }

    public SyncResponse deleteUser(String email) {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();
            
            List<UserRepresentation> users = usersResource.search(email);
            if (!users.isEmpty()) {
                usersResource.delete(users.get(0).getId());
                return new SyncResponse(true, "User deleted successfully");
            } else {
                return new SyncResponse(false, "User not found in Keycloak");
            }
        } catch (Exception e) {
            return new SyncResponse(false, "Error deleting user: " + e.getMessage());
        }
    }

    public SyncResponse syncRole(String roleName, String description) {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            var rolesResource = realmResource.roles();
            
            // Check if role exists
            try {
                var existingRole = rolesResource.get(roleName).toRepresentation();
                // Role already exists, return success with existing role ID
                SyncResponse response = new SyncResponse(true, "Role already exists in Keycloak");
                response.setKeycloakRoleId(existingRole.getId());
                return response;
            } catch (Exception e) {
                // Create new role
                var newRole = new org.keycloak.representations.idm.RoleRepresentation();
                newRole.setName(roleName);
                newRole.setDescription(description);
                
                try {
                    rolesResource.create(newRole);
                    
                    // Wait a moment for the role to be fully created
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                    
                    // Get the created role to get its ID
                    try {
                        var createdRole = rolesResource.get(roleName).toRepresentation();
                        SyncResponse syncResponse = new SyncResponse(true, "Role created successfully");
                        syncResponse.setKeycloakRoleId(createdRole.getId());
                        return syncResponse;
                    } catch (Exception getRoleException) {
                        // If we can't get the role immediately, try to find it in the list
                        try {
                            var allRoles = rolesResource.list();
                            var foundRole = allRoles.stream()
                                .filter(role -> roleName.equals(role.getName()))
                                .findFirst()
                                .orElse(null);
                            
                            if (foundRole != null) {
                                SyncResponse syncResponse = new SyncResponse(true, "Role created successfully");
                                syncResponse.setKeycloakRoleId(foundRole.getId());
                                return syncResponse;
                            } else {
                                return new SyncResponse(true, "Role created but ID not retrieved: " + getRoleException.getMessage());
                            }
                        } catch (Exception listException) {
                            return new SyncResponse(true, "Role created but ID not retrieved: " + listException.getMessage());
                        }
                    }
                } catch (Exception createException) {
                    return new SyncResponse(false, "Failed to create role in Keycloak: " + createException.getMessage());
                }
            }
        } catch (Exception e) {
            // If we can't connect to Keycloak, still return success for database operations
            // This allows the database operation to succeed even if Keycloak sync fails
            return new SyncResponse(true, "Role created in database (Keycloak sync failed: " + e.getMessage() + ")");
        }
    }

    public SyncResponse bulkSyncUsers(List<UserSyncRequest> requests) {
        try {
            List<Map<String, Object>> results = new ArrayList<>();
            int successCount = 0;
            int failureCount = 0;

            for (UserSyncRequest request : requests) {
                try {
                    SyncResponse response = syncUser(request);
                    Map<String, Object> result = new HashMap<>();
                    result.put("email", request.getEmail());
                    result.put("success", response.isSuccess());
                    result.put("message", response.getMessage());
                    result.put("keycloakUserId", response.getKeycloakUserId());
                    result.put("operation", response.getData() != null ? 
                        ((Map<?, ?>) response.getData()).get("operation") : null);
                    results.add(result);

                    if (response.isSuccess()) {
                        successCount++;
                    } else {
                        failureCount++;
                    }
                } catch (Exception e) {
                    Map<String, Object> result = new HashMap<>();
                    result.put("email", request.getEmail());
                    result.put("success", false);
                    result.put("message", "Error processing user: " + e.getMessage());
                    results.add(result);
                    failureCount++;
                }
            }

            SyncResponse response = new SyncResponse(true, 
                String.format("Bulk sync completed. Success: %d, Failures: %d", successCount, failureCount));
            response.setData(Map.of(
                "results", results,
                "totalCount", requests.size(),
                "successCount", successCount,
                "failureCount", failureCount
            ));
            return response;
        } catch (Exception e) {
            return new SyncResponse(false, "Error in bulk sync: " + e.getMessage());
        }
    }

    public SyncResponse getUser(String email) {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();
            
            List<UserRepresentation> users = usersResource.search(email);
            if (!users.isEmpty()) {
                UserRepresentation user = users.get(0);
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("email", user.getEmail());
                userData.put("firstName", user.getFirstName());
                userData.put("lastName", user.getLastName());
                userData.put("enabled", user.isEnabled());
                userData.put("attributes", user.getAttributes());
                
                SyncResponse response = new SyncResponse(true, "User found successfully");
                response.setData(userData);
                response.setKeycloakUserId(user.getId());
                return response;
            } else {
                return new SyncResponse(false, "User not found in Keycloak");
            }
        } catch (Exception e) {
            return new SyncResponse(false, "Error retrieving user: " + e.getMessage());
        }
    }
} 