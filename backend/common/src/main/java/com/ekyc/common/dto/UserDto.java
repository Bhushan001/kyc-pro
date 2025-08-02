package com.ekyc.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Shared User DTO for all services
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto {
    
    private UUID id;
    private String email;
    private String firstname;
    private String lastname;
    private LocalDate dateOfBirth;
    private String country;
    private String role;
    private UUID tenantId;
    private String status;
    private OffsetDateTime lastLogin;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    // For password operations (not serialized in responses)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    
    public UserDto() {}
    
    public UserDto(UUID id, String email, String firstname, String lastname, 
                   LocalDate dateOfBirth, String country, String role, UUID tenantId) {
        this.id = id;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.dateOfBirth = dateOfBirth;
        this.country = country;
        this.role = role;
        this.tenantId = tenantId;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFirstname() {
        return firstname;
    }
    
    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }
    
    public String getLastname() {
        return lastname;
    }
    
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public UUID getTenantId() {
        return tenantId;
    }
    
    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public OffsetDateTime getLastLogin() {
        return lastLogin;
    }
    
    public void setLastLogin(OffsetDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
    
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    /**
     * Get full name (firstname + lastname)
     */
    public String getFullName() {
        if (firstname != null && lastname != null) {
            return firstname + " " + lastname;
        } else if (firstname != null) {
            return firstname;
        } else if (lastname != null) {
            return lastname;
        }
        return null;
    }
    
    /**
     * Check if user is active
     */
    public boolean isActive() {
        return "active".equals(status);
    }
    
    /**
     * Check if user is platform admin
     */
    public boolean isPlatformAdmin() {
        return "platform_admin".equals(role);
    }
    
    /**
     * Check if user is tenant admin
     */
    public boolean isTenantAdmin() {
        return "tenant_admin".equals(role);
    }
    
    /**
     * Check if user is regular user
     */
    public boolean isUser() {
        return "user".equals(role);
    }
} 