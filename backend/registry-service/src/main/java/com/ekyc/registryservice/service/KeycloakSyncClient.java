package com.ekyc.registryservice.service;

import com.ekyc.common.dto.SyncResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class KeycloakSyncClient {

    @Autowired
    @Qualifier("externalRestTemplate")
    private RestTemplate restTemplate;

    private static final String KEYCLOAK_SYNC_SERVICE_URL = "http://localhost:9086/api/keycloak-sync";

    public SyncResponse syncRole(String roleCode, String description) {
        try {
            String url = KEYCLOAK_SYNC_SERVICE_URL + "/roles/sync?roleName=" + roleCode + "&description=" + description;
            System.out.println("=== KeycloakSyncClient Debug ===");
            System.out.println("Calling URL: " + url);
            
            SyncResponse response = restTemplate.postForObject(url, null, SyncResponse.class);
            
            System.out.println("Response received: " + response);
            System.out.println("Response success: " + (response != null ? response.isSuccess() : "null"));
            System.out.println("Response message: " + (response != null ? response.getMessage() : "null"));
            System.out.println("Response keycloakRoleId: " + (response != null ? response.getKeycloakRoleId() : "null"));
            System.out.println("================================");
            
            return response;
        } catch (Exception e) {
            System.out.println("=== KeycloakSyncClient Error ===");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.out.println("================================");
            
            SyncResponse response = new SyncResponse(false, "Failed to sync role to Keycloak: " + e.getMessage());
            return response;
        }
    }

    public SyncResponse deleteRole(String roleCode) {
        try {
            String url = KEYCLOAK_SYNC_SERVICE_URL + "/roles/" + roleCode;
            restTemplate.delete(url);
            return new SyncResponse(true, "Role deleted from Keycloak successfully");
        } catch (Exception e) {
            return new SyncResponse(false, "Failed to delete role from Keycloak: " + e.getMessage());
        }
    }
} 