package com.ekyc.keycloaksyncservice.dto;

import java.util.UUID;

public class SyncResponse {
    
    private boolean success;
    private String message;
    private UUID userId;
    private String keycloakUserId;
    private String operation;
    
    // Constructors
    public SyncResponse() {}
    
    public SyncResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public SyncResponse(boolean success, String message, UUID userId, String keycloakUserId, String operation) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.keycloakUserId = keycloakUserId;
        this.operation = operation;
    }
    
    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    
    public String getKeycloakUserId() { return keycloakUserId; }
    public void setKeycloakUserId(String keycloakUserId) { this.keycloakUserId = keycloakUserId; }
    
    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }
} 