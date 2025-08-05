package com.ekyc.authservice.service;

import com.ekyc.authservice.dto.AuthResponse;
import com.ekyc.common.dto.UserSyncRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class KeycloakAuthService {
    
    private final RestTemplate restTemplate;
    
    @Value("${keycloak.auth-server-url:http://localhost:8080}")
    private String keycloakUrl;
    
    @Value("${keycloak.realm:ekyc}")
    private String realm;
    
    @Value("${keycloak.resource:ekyc-platform-client}")
    private String clientId;
    
    @Value("${keycloak.credentials.secret:emT3O4n4T5sfjuxM1cScYM8RS6bZZoE7}")
    private String clientSecret;
    

    
    public AuthResponse authenticateWithKeycloak(String email, String password) {
        try {
            log.info("Authenticating user with Keycloak: {}", email);
            
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
            
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String accessToken = (String) response.getBody().get("access_token");
                String refreshToken = (String) response.getBody().get("refresh_token");
                
                if (accessToken != null) {
                    log.info("Keycloak authentication successful for user: {}", email);
                    
                    // Get user info from Keycloak
                    UserSyncRequest userInfo = getUserInfoFromKeycloak(accessToken);
                    
                    // Create AuthResponse with Keycloak token
                    AuthResponse authResponse = AuthResponse.builder()
                        .token(accessToken) // Use Keycloak token instead of JWT
                        .userId(userInfo.getUserId())
                        .email(userInfo.getEmail())
                        .firstname(userInfo.getFirstName())
                        .lastname(userInfo.getLastName())
                        .role(userInfo.getRole())
                        .tenantId(userInfo.getTenantId())
                        .build();
                    
                    // Set additional profile information
                    authResponse.setKeycloakId(userInfo.getKeycloakId());
                    authResponse.setStatus(userInfo.getStatus());
                    authResponse.setDateOfBirth(userInfo.getDateOfBirth());
                    authResponse.setCountry(userInfo.getCountry());
                    authResponse.setPhone(userInfo.getPhone());
                    
                    return authResponse;
                }
            }
            
            log.error("Keycloak authentication failed for user: {}", email);
            throw new RuntimeException("Invalid credentials");
            
        } catch (Exception e) {
            log.error("Error authenticating with Keycloak for user {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }
    
    private UserSyncRequest getUserInfoFromKeycloak(String accessToken) {
        try {
            String userInfoUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/userinfo";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            
            HttpEntity<Void> request = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map userInfo = response.getBody();
                
                UserSyncRequest userSyncRequest = new UserSyncRequest();
                userSyncRequest.setEmail((String) userInfo.get("email"));
                userSyncRequest.setFirstName((String) userInfo.get("given_name"));
                userSyncRequest.setLastName((String) userInfo.get("family_name"));
                userSyncRequest.setKeycloakId((String) userInfo.get("sub"));
                
                // Set default values for missing fields
                userSyncRequest.setRole("PLATFORM_USER");
                userSyncRequest.setStatus("active");
                
                return userSyncRequest;
            }
            
            throw new RuntimeException("Failed to get user info from Keycloak");
            
        } catch (Exception e) {
            log.error("Error getting user info from Keycloak: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get user info: " + e.getMessage());
        }
    }
} 