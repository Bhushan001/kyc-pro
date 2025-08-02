package com.ekyc.registryservice.dto;

import com.ekyc.registryservice.enums.RoleCategory;
import com.ekyc.registryservice.enums.RoleStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

public class RoleResponse {
    
    private UUID id;
    private String roleName;
    private String roleCode;
    private String description;
    private RoleCategory category;
    private RoleStatus status;
    private String keycloakRoleId;
    private UUID tenantId;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    // Constructors
    public RoleResponse() {}
    
    public RoleResponse(UUID id, String roleName, String roleCode, String description, 
                       RoleCategory category, RoleStatus status, String keycloakRoleId, 
                       UUID tenantId, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.roleName = roleName;
        this.roleCode = roleCode;
        this.description = description;
        this.category = category;
        this.status = status;
        this.keycloakRoleId = keycloakRoleId;
        this.tenantId = tenantId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
    
    public String getRoleCode() { return roleCode; }
    public void setRoleCode(String roleCode) { this.roleCode = roleCode; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public RoleCategory getCategory() { return category; }
    public void setCategory(RoleCategory category) { this.category = category; }
    
    public RoleStatus getStatus() { return status; }
    public void setStatus(RoleStatus status) { this.status = status; }
    
    public String getKeycloakRoleId() { return keycloakRoleId; }
    public void setKeycloakRoleId(String keycloakRoleId) { this.keycloakRoleId = keycloakRoleId; }
    
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
} 