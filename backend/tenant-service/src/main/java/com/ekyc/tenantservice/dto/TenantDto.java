package com.ekyc.tenantservice.dto;

import java.util.Map;
import java.util.UUID;

public record TenantDto(
    UUID id,
    String name,
    String domain,
    String status,
    String plan,
    Map<String, Object> settings,
    Map<String, Object> branding
) {}
