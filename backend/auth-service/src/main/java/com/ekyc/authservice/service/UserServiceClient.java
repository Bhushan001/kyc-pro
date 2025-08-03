package com.ekyc.authservice.service;

import com.ekyc.common.dto.UserSyncRequest;
import com.ekyc.authservice.dto.CreateUserRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
public class UserServiceClient {
    
    private static final Logger logger = LoggerFactory.getLogger(UserServiceClient.class);
    
    private final RestTemplate restTemplate;
    
    @Value("${user.service.url:http://localhost:9082}")
    private String userServiceUrl;
    
    public UserServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    public UserSyncRequest createUser(UserSyncRequest userRequest) {
        try {
            logger.info("Creating user via user service: {}", userRequest.getEmail());
            
            // Call the unified signup endpoint that handles both database and Keycloak
            return restTemplate.postForObject(
                userServiceUrl + "/api/users/signup",
                userRequest,
                UserSyncRequest.class
            );
            
        } catch (Exception e) {
            logger.error("Error creating user via user service: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create user: " + e.getMessage());
        }
    }
    
    public UserSyncRequest findUserByEmail(String email) {
        try {
            logger.info("Finding user by email via user service: {}", email);
            
            return restTemplate.getForObject(
                userServiceUrl + "/api/users/email/" + email,
                UserSyncRequest.class
            );
            
        } catch (Exception e) {
            logger.error("Error finding user via user service: {}", e.getMessage(), e);
            return null;
        }
    }
    
    public boolean validateUserCredentials(String email, String password) {
        try {
            logger.info("Validating user credentials via user service: {}", email);
            
            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            // Create form data
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("email", email);
            formData.add("password", password);
            
            // Create request entity
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);
            
            Boolean result = restTemplate.postForObject(
                userServiceUrl + "/api/users/validate-credentials",
                request,
                Boolean.class
            );
            
            return result != null && result;
            
        } catch (Exception e) {
            logger.error("Error validating credentials via user service: {}", e.getMessage(), e);
            return false;
        }
    }
} 