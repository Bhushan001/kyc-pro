package com.ekyc.subscriptionservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubscriptionRequest {
  @NotNull
  private UUID tenantId;
  @NotNull
  private UUID moduleId;
  @NotBlank
  private String billingCycle;
  @NotNull
  private BigDecimal price;
}
