package com.ekyc.subscriptionservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public class CreateSubscriptionRequest {
  @NotNull
  private UUID tenantId;
  @NotNull
  private UUID moduleId;
  @NotBlank
  private String billingCycle;
  @NotNull
  private BigDecimal price;

  // getters and setters
  public UUID getTenantId() { return tenantId; }
  public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
  public UUID getModuleId() { return moduleId; }
  public void setModuleId(UUID moduleId) { this.moduleId = moduleId; }
  public String getBillingCycle() { return billingCycle; }
  public void setBillingCycle(String billingCycle) { this.billingCycle = billingCycle; }
  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }
}
