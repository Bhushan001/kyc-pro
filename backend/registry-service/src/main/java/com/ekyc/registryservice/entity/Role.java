package com.ekyc.registryservice.entity;

import com.ekyc.registryservice.enums.RoleCategory;
import com.ekyc.registryservice.enums.RoleStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.GenericGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "roles", schema = "registry")
public class Role {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @NotBlank
    @Column(name = "role_name", unique = true, nullable = false)
    private String roleName;

    @NotBlank
    @Column(name = "role_code", unique = true, nullable = false)
    private String roleCode;

    @Column(name = "description", length = 500)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private RoleCategory category;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RoleStatus status = RoleStatus.DRAFT;

    @Column(name = "keycloak_role_id")
    private String keycloakRoleId;

    @Column(name = "tenant_id")
    private UUID tenantId;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    // Constructors
    public Role() {}

    public Role(String roleName, String roleCode, String description, RoleCategory category) {
        this.roleName = roleName;
        this.roleCode = roleCode;
        this.description = description;
        this.category = category;
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