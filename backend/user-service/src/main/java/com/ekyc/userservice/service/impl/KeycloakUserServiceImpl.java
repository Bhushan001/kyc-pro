package com.ekyc.userservice.service.impl;

import com.ekyc.common.dto.UserSyncRequest;
import com.ekyc.userservice.service.KeycloakUserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@Service
public class KeycloakUserServiceImpl implements KeycloakUserService {

    private static final Logger logger = LoggerFactory.getLogger(KeycloakUserServiceImpl.class);
    
    private final RestTemplate restTemplate;
    
    @Value("${keycloak.auth-server-url:http://localhost:8080}")
    private String keycloakUrl;
    
    @Value("${keycloak.realm:ekyc}")
    private String realm;
    
    @Value("${keycloak.resource:ekyc-platform-client}")
    private String clientId;
    
    @Value("${keycloak.credentials.secret:emT3O4n4T5sfjuxM1cScYM8RS6bZZoE7}")
    private String clientSecret;
    
    @Value("${keycloak.admin.username:admin}")
    private String adminUsername;
    
    @Value("${keycloak.admin.password:admin123}")
    private String adminPassword;

    public KeycloakUserServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public UserSyncRequest createUser(UserSyncRequest request) {
        try {
            logger.info("Creating user in Keycloak: {}", request.getEmail());
            
            // Check Keycloak connection first
            checkKeycloakConnection();
            
            // Get admin access token
            String adminToken = getAdminAccessToken();
            
            // Ensure the role exists before creating user
            ensureRoleExists(request.getRole(), adminToken);
            
            // Create user in Keycloak
            String keycloakUserId = createKeycloakUser(request, adminToken);
            logger.info("Created Keycloak user with ID: {}", keycloakUserId);
            
            // Assign role to user
            try {
                assignRoleToUser(keycloakUserId, request.getRole(), adminToken);
            } catch (Exception e) {
                logger.warn("Failed to assign role to user, but continuing with user creation: {}", e.getMessage());
                // Continue with user creation even if role assignment fails
            }
            
            // Set password for user
            setUserPassword(keycloakUserId, request.getPasswordHash(), adminToken);
            
            // Create response with Keycloak user ID
            UserSyncRequest keycloakUser = new UserSyncRequest();
            keycloakUser.setUserId(UUID.fromString(keycloakUserId));
            keycloakUser.setEmail(request.getEmail());
            keycloakUser.setFirstName(request.getFirstName());
            keycloakUser.setLastName(request.getLastName());
            keycloakUser.setDateOfBirth(request.getDateOfBirth());
            keycloakUser.setCountry(request.getCountry());
            keycloakUser.setPhone(request.getPhone());
            keycloakUser.setRole(request.getRole());
            keycloakUser.setTenantId(request.getTenantId());
            keycloakUser.setStatus(request.getStatus());
            keycloakUser.setCreatedAt(OffsetDateTime.now());
            keycloakUser.setUpdatedAt(OffsetDateTime.now());
            
            logger.info("Successfully created user in Keycloak: {}", keycloakUserId);
            return keycloakUser;
            
        } catch (Exception e) {
            logger.error("Error creating user in Keycloak: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create user in Keycloak: " + e.getMessage());
        }
    }

    @Override
    public UserSyncRequest createSocialUser(UserSyncRequest request) {
        // For social users, we'll use the same logic as regular users for now
        return createUser(request);
    }

    @Override
    public UserSyncRequest findByEmail(String email) {
        try {
            String adminToken = getAdminAccessToken();
            String keycloakUserId = findKeycloakUserByEmail(email, adminToken);
            
            if (keycloakUserId != null) {
                UserSyncRequest user = new UserSyncRequest();
                user.setUserId(UUID.fromString(keycloakUserId));
                user.setEmail(email);
                return user;
            }
            return null;
        } catch (Exception e) {
            logger.error("Error finding user by email in Keycloak: {}", e.getMessage(), e);
            return null;
        }
    }

    @Override
    public UserSyncRequest findBySocialProvider(String socialProvider, String socialUserId) {
        // TODO: Implement social provider lookup
        return null;
    }

    @Override
    public UserSyncRequest findById(String keycloakUserId) {
        try {
            String adminToken = getAdminAccessToken();
            return getKeycloakUserById(keycloakUserId, adminToken);
        } catch (Exception e) {
            logger.error("Error finding user by ID in Keycloak: {}", e.getMessage(), e);
            return null;
        }
    }

    @Override
    public UserSyncRequest updateUser(UserSyncRequest request) {
        try {
            String adminToken = getAdminAccessToken();
            updateKeycloakUser(request, adminToken);
            request.setUpdatedAt(OffsetDateTime.now());
            return request;
        } catch (Exception e) {
            logger.error("Error updating user in Keycloak: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update user in Keycloak: " + e.getMessage());
        }
    }

    @Override
    public void updateAppUserId(String keycloakUserId, UUID appUserId) {
        try {
            String adminToken = getAdminAccessToken();
            updateUserAttribute(keycloakUserId, "app_user_id", appUserId.toString(), adminToken);
        } catch (Exception e) {
            logger.error("Error updating app user ID in Keycloak: {}", e.getMessage(), e);
        }
    }

    @Override
    public boolean validatePassword(UserSyncRequest user, String password) {
        try {
            // Try to authenticate the user with the provided password
            return authenticateUser(user.getEmail(), password);
        } catch (Exception e) {
            logger.error("Error validating password in Keycloak: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public void deleteUser(String keycloakUserId) {
        try {
            String adminToken = getAdminAccessToken();
            deleteKeycloakUser(keycloakUserId, adminToken);
        } catch (Exception e) {
            logger.error("Error deleting user from Keycloak: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete user from Keycloak: " + e.getMessage());
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        return findByEmail(email) != null;
    }

    @Override
    public boolean existsById(String keycloakUserId) {
        return findById(keycloakUserId) != null;
    }

    @Override
    public void assignRole(String keycloakUserId, String role) {
        try {
            String adminToken = getAdminAccessToken();
            
            // First, ensure the role exists
            ensureRoleExists(role, adminToken);
            
            // Then assign the role to the user
            assignRoleToUser(keycloakUserId, role, adminToken);
        } catch (Exception e) {
            logger.error("Error assigning role in Keycloak: {}", e.getMessage(), e);
        }
    }

    @Override
    public void removeRole(String keycloakUserId, String role) {
        try {
            String adminToken = getAdminAccessToken();
            removeRoleFromUser(keycloakUserId, role, adminToken);
        } catch (Exception e) {
            logger.error("Error removing role from Keycloak: {}", e.getMessage(), e);
        }
    }

    // Helper methods for Keycloak API calls

    private void checkKeycloakConnection() {
        try {
            String healthUrl = keycloakUrl + "/health/ready";
            ResponseEntity<String> response = restTemplate.getForEntity(healthUrl, String.class);
            if (response.getStatusCode() != HttpStatus.OK) {
                logger.error("Keycloak is not ready. Status: {}", response.getStatusCode());
                throw new RuntimeException("Keycloak is not ready");
            }
            logger.info("Keycloak is ready");
        } catch (Exception e) {
            logger.error("Cannot connect to Keycloak: {}", e.getMessage());
            throw new RuntimeException("Cannot connect to Keycloak: " + e.getMessage());
        }
    }

    private String getAdminAccessToken() {
        try {
            String tokenUrl = keycloakUrl + "/realms/master/protocol/openid-connect/token";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "password");
            body.add("client_id", "admin-cli");
            body.add("username", adminUsername);
            body.add("password", adminPassword);
            
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            
            logger.debug("Requesting admin access token from: {}", tokenUrl);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String accessToken = (String) response.getBody().get("access_token");
                if (accessToken != null) {
                    logger.debug("Successfully obtained admin access token");
                    return accessToken;
                } else {
                    logger.error("Access token not found in response");
                }
            } else {
                logger.error("Failed to get admin access token. Status: {}", response.getStatusCode());
            }
            
            throw new RuntimeException("Failed to get admin access token. Status: " + response.getStatusCode());
            
        } catch (Exception e) {
            logger.error("Error getting admin access token: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get admin access token: " + e.getMessage());
        }
    }

    private String createKeycloakUser(UserSyncRequest request, String adminToken) {
        try {
            String usersUrl = keycloakUrl + "/admin/realms/" + realm + "/users";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(adminToken);
            
            Map<String, Object> userRepresentation = new HashMap<>();
            userRepresentation.put("username", request.getEmail());
            userRepresentation.put("email", request.getEmail());
            userRepresentation.put("firstName", request.getFirstName());
            userRepresentation.put("lastName", request.getLastName());
            userRepresentation.put("enabled", true);
            userRepresentation.put("emailVerified", true);
            
            // Add custom attributes
            Map<String, Object> attributes = new HashMap<>();
            attributes.put("dateOfBirth", request.getDateOfBirth());
            attributes.put("country", request.getCountry());
            attributes.put("phone", request.getPhone());
            attributes.put("role", request.getRole());
            if (request.getTenantId() != null) {
                attributes.put("tenantId", request.getTenantId().toString());
            }
            userRepresentation.put("attributes", attributes);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(userRepresentation, headers);
            
            logger.debug("Creating user in Keycloak with data: {}", userRepresentation);
            
            ResponseEntity<Void> response = restTemplate.postForEntity(usersUrl, requestEntity, Void.class);
            
            if (response.getStatusCode() == HttpStatus.CREATED) {
                // Extract user ID from Location header
                String location = response.getHeaders().getFirst("Location");
                logger.debug("User creation response - Location header: {}", location);
                if (location != null) {
                    String userId = location.substring(location.lastIndexOf("/") + 1);
                    logger.info("Successfully created user with ID: {}", userId);
                    return userId;
                }
            }
            
            logger.error("Failed to create user in Keycloak. Status: {}", response.getStatusCode());
            throw new RuntimeException("Failed to create user in Keycloak. Status: " + response.getStatusCode());
            
        } catch (HttpClientErrorException e) {
            logger.error("HTTP error creating user in Keycloak: {}", e.getMessage());
            throw new RuntimeException("Failed to create user in Keycloak: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating user in Keycloak: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create user in Keycloak: " + e.getMessage());
        }
    }

    private void assignRoleToUser(String keycloakUserId, String role, String adminToken) {
        try {
            // First, get the role ID
            String roleId = getRoleId(role, adminToken);
            
            // Check if user already has this role
            if (userHasRole(keycloakUserId, role, adminToken)) {
                logger.info("User {} already has role {}, skipping assignment", keycloakUserId, role);
                return;
            }
            
            // Then assign the role to the user
            String roleMappingUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + keycloakUserId + "/role-mappings/realm";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(adminToken);
            
            // Create role mapping array with single role
            Map<String, Object> roleMapping = new HashMap<>();
            roleMapping.put("id", roleId);
            roleMapping.put("name", role);
            
            // Wrap in array as Keycloak expects
            Map<String, Object>[] roleMappings = new Map[]{roleMapping};
            
            logger.debug("Assigning role mapping: {}", roleMapping);
            
            HttpEntity<Map<String, Object>[]> requestEntity = new HttpEntity<>(roleMappings, headers);
            
            ResponseEntity<Void> response = restTemplate.postForEntity(roleMappingUrl, requestEntity, Void.class);
            
            if (response.getStatusCode() != HttpStatus.NO_CONTENT && response.getStatusCode() != HttpStatus.OK) {
                // If the role assignment fails, check if it's because the role is already assigned
                if (userHasRole(keycloakUserId, role, adminToken)) {
                    logger.info("Role {} is already assigned to user {}, considering this a success", role, keycloakUserId);
                    return;
                }
                logger.error("Failed to assign role {} to user {}. Status: {}", role, keycloakUserId, response.getStatusCode());
                throw new RuntimeException("Failed to assign role to user. Status: " + response.getStatusCode());
            }
            
            logger.info("Successfully assigned role {} to user {}", role, keycloakUserId);
            
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                // Check if the role is already assigned
                if (userHasRole(keycloakUserId, role, adminToken)) {
                    logger.info("Role {} is already assigned to user {}, considering this a success", role, keycloakUserId);
                    return;
                }
                logger.error("Bad request when assigning role {} to user {}: {}", role, keycloakUserId, e.getMessage());
                throw new RuntimeException("Failed to assign role to user (Bad Request): " + e.getMessage());
            }
            logger.error("HTTP error assigning role {} to user {}: {}", role, keycloakUserId, e.getMessage(), e);
            throw new RuntimeException("Failed to assign role to user: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error assigning role {} to user {}: {}", role, keycloakUserId, e.getMessage(), e);
            throw new RuntimeException("Failed to assign role to user: " + e.getMessage());
        }
    }

    private String getRoleId(String roleName, String adminToken) {
        try {
            String rolesUrl = keycloakUrl + "/admin/realms/" + realm + "/roles";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<Map[]> response = restTemplate.exchange(rolesUrl, HttpMethod.GET, requestEntity, Map[].class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                logger.info("Found {} roles in Keycloak", response.getBody().length);
                for (Map role : response.getBody()) {
                    String name = (String) role.get("name");
                    String id = (String) role.get("id");
                    logger.debug("Role: {} (ID: {})", name, id);
                    if (roleName.equals(name)) {
                        logger.info("Found role {} with ID {}", roleName, id);
                        return id;
                    }
                }
                
                // Log all available roles for debugging
                logger.error("Role '{}' not found. Available roles:", roleName);
                for (Map role : response.getBody()) {
                    logger.error("  - {}", role.get("name"));
                }
            } else {
                logger.error("Failed to get roles from Keycloak. Status: {}", response.getStatusCode());
            }
            
            throw new RuntimeException("Role not found: " + roleName);
            
        } catch (Exception e) {
            logger.error("Error getting role ID for role '{}': {}", roleName, e.getMessage(), e);
            throw new RuntimeException("Failed to get role ID for role: " + roleName + ". Error: " + e.getMessage());
        }
    }

    private void setUserPassword(String keycloakUserId, String password, String adminToken) {
        String passwordUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + keycloakUserId + "/reset-password";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);
        
        Map<String, Object> passwordRepresentation = new HashMap<>();
        passwordRepresentation.put("type", "password");
        passwordRepresentation.put("value", password);
        passwordRepresentation.put("temporary", false);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(passwordRepresentation, headers);
        
        restTemplate.put(passwordUrl, requestEntity);
    }

    private String findKeycloakUserByEmail(String email, String adminToken) {
        String usersUrl = keycloakUrl + "/admin/realms/" + realm + "/users?email=" + email;
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);
        
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        
        ResponseEntity<Map[]> response = restTemplate.exchange(usersUrl, HttpMethod.GET, requestEntity, Map[].class);
        
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null && response.getBody().length > 0) {
            return (String) response.getBody()[0].get("id");
        }
        
        return null;
    }

    private UserSyncRequest getKeycloakUserById(String keycloakUserId, String adminToken) {
        String userUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + keycloakUserId;
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);
        
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        
        ResponseEntity<Map> response = restTemplate.exchange(userUrl, HttpMethod.GET, requestEntity, Map.class);
        
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map userData = response.getBody();
            UserSyncRequest user = new UserSyncRequest();
            user.setUserId(UUID.fromString(keycloakUserId));
            user.setEmail((String) userData.get("email"));
            user.setFirstName((String) userData.get("firstName"));
            user.setLastName((String) userData.get("lastName"));
            return user;
        }
        
        return null;
    }

    private void updateKeycloakUser(UserSyncRequest request, String adminToken) {
        String userUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + request.getUserId();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);
        
        Map<String, Object> userRepresentation = new HashMap<>();
        userRepresentation.put("email", request.getEmail());
        userRepresentation.put("firstName", request.getFirstName());
        userRepresentation.put("lastName", request.getLastName());
        userRepresentation.put("enabled", true);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(userRepresentation, headers);
        
        restTemplate.put(userUrl, requestEntity);
    }

    private void updateUserAttribute(String keycloakUserId, String attributeName, String attributeValue, String adminToken) {
        String userUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + keycloakUserId;
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);
        
        Map<String, Object> userRepresentation = new HashMap<>();
        Map<String, Object> attributes = new HashMap<>();
        attributes.put(attributeName, attributeValue);
        userRepresentation.put("attributes", attributes);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(userRepresentation, headers);
        
        restTemplate.put(userUrl, requestEntity);
    }

    private boolean authenticateUser(String email, String password) {
        String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("username", email);
        body.add("password", password);
        
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }

    private void deleteKeycloakUser(String keycloakUserId, String adminToken) {
        try {
            String userUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + keycloakUserId;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
            
            logger.info("Deleting user from Keycloak: {}", keycloakUserId);
            
            ResponseEntity<Void> response = restTemplate.exchange(userUrl, HttpMethod.DELETE, requestEntity, Void.class);
            
            if (response.getStatusCode() == HttpStatus.NO_CONTENT || response.getStatusCode() == HttpStatus.OK) {
                logger.info("Successfully deleted user from Keycloak: {}", keycloakUserId);
            } else {
                logger.warn("Unexpected status code when deleting user from Keycloak: {}", response.getStatusCode());
            }
            
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                logger.info("User {} not found in Keycloak, already deleted or doesn't exist", keycloakUserId);
                return; // Consider this a success if user doesn't exist
            }
            logger.error("HTTP error deleting user from Keycloak: {}", e.getMessage());
            throw new RuntimeException("Failed to delete user from Keycloak: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error deleting user from Keycloak: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete user from Keycloak: " + e.getMessage());
        }
    }

    private void ensureRoleExists(String roleName, String adminToken) {
        try {
            // Try to get the role ID - if it exists, we're good
            getRoleId(roleName, adminToken);
            logger.info("Role '{}' already exists", roleName);
        } catch (Exception e) {
            // Role doesn't exist, create it
            logger.info("Role '{}' does not exist, creating it", roleName);
            createRole(roleName, adminToken);
        }
    }
    
    private boolean userHasRole(String keycloakUserId, String roleName, String adminToken) {
        try {
            String roleMappingsUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + keycloakUserId + "/role-mappings/realm";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<Map[]> response = restTemplate.exchange(roleMappingsUrl, HttpMethod.GET, requestEntity, Map[].class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                for (Map role : response.getBody()) {
                    if (roleName.equals(role.get("name"))) {
                        return true;
                    }
                }
            }
            
            return false;
            
        } catch (Exception e) {
            logger.warn("Error checking if user has role: {}", e.getMessage());
            return false;
        }
    }
    
    private void createRole(String roleName, String adminToken) {
        try {
            String rolesUrl = keycloakUrl + "/admin/realms/" + realm + "/roles";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(adminToken);
            
            Map<String, Object> roleRepresentation = new HashMap<>();
            roleRepresentation.put("name", roleName);
            roleRepresentation.put("description", "Role for " + roleName);
            roleRepresentation.put("composite", false);
            roleRepresentation.put("clientRole", false);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(roleRepresentation, headers);
            
            ResponseEntity<Void> response = restTemplate.postForEntity(rolesUrl, requestEntity, Void.class);
            
            if (response.getStatusCode() == HttpStatus.CREATED) {
                logger.info("Successfully created role: {}", roleName);
            } else {
                logger.error("Failed to create role {}. Status: {}", roleName, response.getStatusCode());
                throw new RuntimeException("Failed to create role: " + roleName);
            }
            
        } catch (Exception e) {
            logger.error("Error creating role '{}': {}", roleName, e.getMessage(), e);
            throw new RuntimeException("Failed to create role: " + roleName + ". Error: " + e.getMessage());
        }
    }
    
    private void removeRoleFromUser(String keycloakUserId, String role, String adminToken) {
        String roleId = getRoleId(role, adminToken);
        String roleMappingUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + keycloakUserId + "/role-mappings/realm";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);
        
        Map<String, Object> roleMapping = new HashMap<>();
        roleMapping.put("id", roleId);
        roleMapping.put("name", role);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(roleMapping, headers);
        
        restTemplate.exchange(roleMappingUrl, HttpMethod.DELETE, requestEntity, Void.class);
    }
} 