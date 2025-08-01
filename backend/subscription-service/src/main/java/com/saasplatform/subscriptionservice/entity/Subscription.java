package com.saasplatform.subscriptionservice.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscriptions", schema = "billing")
public class Subscription {
  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
  private UUID id;

  @Column(name = "tenant_id", nullable = false)
  private UUID tenantId;

  @Column(name = "module_id", nullable = false)
  private UUID moduleId;

  @Column(name = "billing_cycle", nullable = false)
  private String billingCycle;

  @Column(nullable = false)
  private String status = "active";

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @Column(name = "subscribed_at")
  private OffsetDateTime subscribedAt = OffsetDateTime.now();

  @Column(name = "expires_at")
  private OffsetDateTime expiresAt;

  // Getters and setters

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public UUID getTenantId() { return tenantId; }
  public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
  public UUID getModuleId() { return moduleId; }
  public void setModuleId(UUID moduleId) { this.moduleId = moduleId; }
  public String getBillingCycle() { return billingCycle; }
  public void setBillingCycle(String billingCycle) { this.billingCycle = billingCycle; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }
  public OffsetDateTime getSubscribedAt() { return subscribedAt; }
  public void setSubscribedAt(OffsetDateTime subscribedAt) { this.subscribedAt = subscribedAt; }
  public OffsetDateTime getExpiresAt() { return expiresAt; }
  public void setExpiresAt(OffsetDateTime expiresAt) { this.expiresAt = expiresAt; }
}
