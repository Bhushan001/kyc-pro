package com.ekyc.registryservice.service;

import com.ekyc.keycloaksyncservice.dto.SyncResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class KeycloakSyncClient {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${keycloak.sync.service.url:http://localhost:9080/api/keycloak-sync}")
    private String keycloakSyncServiceUrl;
    
    public SyncResponse syncRole(String roleName, String description) {
        String url = keycloakSyncServiceUrl + "/roles/sync?roleName=" + roleName + "&description=" + description;
        return restTemplate.postForObject(url, null, SyncResponse.class);
    }
    
    public SyncResponse deleteRole(String roleName) {
        String url = keycloakSyncServiceUrl + "/roles/" + roleName;
        restTemplate.delete(url);
        return new SyncResponse(true, "Role deleted from Keycloak");
    }
} 