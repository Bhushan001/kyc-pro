package com.ekyc.registryservice.dto;

import com.ekyc.registryservice.enums.RoleCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.UUID;

public class CreateRoleRequest {
    
    @NotBlank(message = "Role name is required")
    private String roleName;
    
    @NotBlank(message = "Role code is required")
    @Pattern(regexp = "^ROLE_[A-Z_]+$", message = "Role code must start with 'ROLE_' and contain only uppercase letters and underscores")
    private String roleCode;
    
    private String description;
    
    @NotNull(message = "Role category is required")
    private RoleCategory category;
    
    private UUID tenantId; // Optional, for tenant-specific roles
    
    // Constructors
    public CreateRoleRequest() {}
    
    public CreateRoleRequest(String roleName, String roleCode, String description, RoleCategory category) {
        this.roleName = roleName;
        this.roleCode = roleCode;
        this.description = description;
        this.category = category;
    }
    
    // Getters and Setters
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
    
    public String getRoleCode() { return roleCode; }
    public void setRoleCode(String roleCode) { this.roleCode = roleCode; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public RoleCategory getCategory() { return category; }
    public void setCategory(RoleCategory category) { this.category = category; }
    
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
} 