package com.ekyc.subscriptionservice.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record SubscriptionDto(
  UUID id,
  UUID tenantId,
  UUID moduleId,
  String billingCycle,
  String status,
  BigDecimal price,
  OffsetDateTime subscribedAt,
  OffsetDateTime expiresAt
) {}
