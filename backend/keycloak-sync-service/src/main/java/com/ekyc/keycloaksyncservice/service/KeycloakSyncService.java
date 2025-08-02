package com.ekyc.keycloaksyncservice.service;

import com.ekyc.keycloaksyncservice.dto.SyncRequest;
import com.ekyc.keycloaksyncservice.dto.SyncResponse;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialsRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class KeycloakSyncService {

    @Autowired
    private Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public SyncResponse syncUser(SyncRequest request) {
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
                
                return new SyncResponse(true, "User updated successfully", 
                    request.getUserId(), existingUser.getId(), "UPDATE");
            } else {
                // Create new user
                UserRepresentation newUser = createUserRepresentation(request);
                var response = usersResource.create(newUser);
                
                if (response.getStatus() == 201) {
                    String userId = response.getLocation().getPath().substring(
                        response.getLocation().getPath().lastIndexOf('/') + 1);
                    
                    // Assign role to user
                    assignRoleToUser(userId, request.getRole());
                    
                    return new SyncResponse(true, "User created successfully", 
                        request.getUserId(), userId, "CREATE");
                } else {
                    return new SyncResponse(false, "Failed to create user in Keycloak");
                }
            }
        } catch (Exception e) {
            return new SyncResponse(false, "Error syncing user: " + e.getMessage());
        }
    }

    private UserRepresentation createUserRepresentation(SyncRequest request) {
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        // Set attributes
        Map<String, List<String>> attributes = new HashMap<>();
        attributes.put("tenantId", Arrays.asList(request.getTenantId().toString()));
        attributes.put("tenantName", Arrays.asList(request.getTenantName()));
        attributes.put("appUserId", Arrays.asList(request.getUserId().toString()));
        user.setAttributes(attributes);
        
        // Set credentials (temporary password)
        CredentialsRepresentation credentials = new CredentialsRepresentation();
        credentials.setType(CredentialsRepresentation.PASSWORD);
        credentials.setValue("tempPassword123"); // User will change on first login
        credentials.setTemporary(true);
        user.setCredentials(Arrays.asList(credentials));
        
        return user;
    }

    private void updateUserInKeycloak(UserRepresentation user, SyncRequest request) {
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        
        // Update attributes
        Map<String, List<String>> attributes = new HashMap<>();
        attributes.put("tenantId", Arrays.asList(request.getTenantId().toString()));
        attributes.put("tenantName", Arrays.asList(request.getTenantName()));
        attributes.put("appUserId", Arrays.asList(request.getUserId().toString()));
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
                // Update existing role
                existingRole.setDescription(description);
                rolesResource.get(roleName).update(existingRole);
                return new SyncResponse(true, "Role updated successfully");
            } catch (Exception e) {
                // Create new role
                var newRole = new org.keycloak.representations.idm.RoleRepresentation();
                newRole.setName(roleName);
                newRole.setDescription(description);
                rolesResource.create(newRole);
                return new SyncResponse(true, "Role created successfully");
            }
        } catch (Exception e) {
            return new SyncResponse(false, "Error syncing role: " + e.getMessage());
        }
    }
} 