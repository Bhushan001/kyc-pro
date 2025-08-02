package com.ekyc.moduleservice.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ModuleDto(
    UUID id,
    String name,
    String description,
    String category,
    List<String> features,
    BigDecimal monthlyPrice,
    BigDecimal yearlyPrice,
    String status
) {}
