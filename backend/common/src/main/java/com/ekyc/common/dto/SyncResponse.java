package com.ekyc.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Response DTO for synchronization operations
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SyncResponse {
    
    private boolean success;
    private String message;
    private String errorCode;
    private Object data;
    private String keycloakUserId; // For backward compatibility
    private String keycloakRoleId; // For role-specific operations
    
    public SyncResponse() {}
    
    public SyncResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public SyncResponse(boolean success, String message, String errorCode) {
        this.success = success;
        this.message = message;
        this.errorCode = errorCode;
    }
    
    public SyncResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
    
    public Object getData() {
        return data;
    }
    
    public void setData(Object data) {
        this.data = data;
    }
    
    public String getKeycloakUserId() {
        return keycloakUserId;
    }
    
    public void setKeycloakUserId(String keycloakUserId) {
        this.keycloakUserId = keycloakUserId;
    }
    
    public String getKeycloakRoleId() {
        return keycloakRoleId;
    }
    
    public void setKeycloakRoleId(String keycloakRoleId) {
        this.keycloakRoleId = keycloakRoleId;
    }
} 