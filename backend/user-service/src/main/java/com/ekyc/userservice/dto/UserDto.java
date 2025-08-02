package com.ekyc.userservice.dto;

import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String name,
        String role,
        UUID tenantId,
        String status
) {}
