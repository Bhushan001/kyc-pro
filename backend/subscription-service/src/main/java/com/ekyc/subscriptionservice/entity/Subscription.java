package com.ekyc.subscriptionservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscriptions", schema = "billing")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
  @Builder.Default
  private String status = "active";

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @Column(name = "subscribed_at")
  @Builder.Default
  private OffsetDateTime subscribedAt = OffsetDateTime.now();

  @Column(name = "expires_at")
  private OffsetDateTime expiresAt;

}
