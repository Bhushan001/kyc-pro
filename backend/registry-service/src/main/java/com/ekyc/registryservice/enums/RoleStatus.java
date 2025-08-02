package com.ekyc.registryservice.enums;

public enum RoleStatus {
    DRAFT,      // Created but not synced to Keycloak
    ACTIVE,     // Synced to Keycloak and active
    INACTIVE,   // Disabled but not deleted
    DELETED     // Soft deleted
} 