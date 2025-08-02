package com.ekyc.registryservice.enums;

public enum RoleCategory {
    PLATFORM,    // Platform-wide roles (super admin, platform admin)
    TENANT,      // Tenant-specific roles (tenant admin, tenant user)
    MODULE,      // Module-specific roles (module admin, module user)
    CUSTOM       // Custom user-defined roles
} 