package com.ekyc.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Unified user synchronization request for both application and social signup
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserSyncRequest {
    
    // User identification
    private UUID userId;
    private String email;
    private String username;
    
    // User details
    private String firstName;
    private String lastName;
    private String dateOfBirth;
    private String country;
    private String phone;
    
    // Authentication details
    private String passwordHash; // For application signup
    private String socialProvider; // For social signup (GOOGLE, FACEBOOK, etc.)
    private String socialUserId; // External social provider user ID
    
    // Tenant and role information
    private UUID tenantId;
    private String tenantName;
    private String role;
    
    // Status and metadata
    private String status = "active";
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    // Sync metadata
    private String syncSource; // "APPLICATION" or "SOCIAL"
    private String syncDirection; // "DB_TO_KEYCLOAK" or "KEYCLOAK_TO_DB"
    private boolean emailVerified = false;
    
    // Constructors
    public UserSyncRequest() {}
    
    public UserSyncRequest(String email, String firstName, String lastName, String role) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }
    
    // Getters and Setters
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    
    public String getSocialProvider() { return socialProvider; }
    public void setSocialProvider(String socialProvider) { this.socialProvider = socialProvider; }
    
    public String getSocialUserId() { return socialUserId; }
    public void setSocialUserId(String socialUserId) { this.socialUserId = socialUserId; }
    
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    
    public String getTenantName() { return tenantName; }
    public void setTenantName(String tenantName) { this.tenantName = tenantName; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getSyncSource() { return syncSource; }
    public void setSyncSource(String syncSource) { this.syncSource = syncSource; }
    
    public String getSyncDirection() { return syncDirection; }
    public void setSyncDirection(String syncDirection) { this.syncDirection = syncDirection; }
    
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    
    // Helper methods
    public boolean isApplicationSignup() {
        return "APPLICATION".equals(syncSource);
    }
    
    public boolean isSocialSignup() {
        return "SOCIAL".equals(syncSource);
    }
    
    public boolean isDbToKeycloakSync() {
        return "DB_TO_KEYCLOAK".equals(syncDirection);
    }
    
    public boolean isKeycloakToDbSync() {
        return "KEYCLOAK_TO_DB".equals(syncDirection);
    }
    
    public boolean hasPassword() {
        return passwordHash != null && !passwordHash.isEmpty();
    }
    
    public boolean hasSocialProvider() {
        return socialProvider != null && !socialProvider.isEmpty();
    }
} 