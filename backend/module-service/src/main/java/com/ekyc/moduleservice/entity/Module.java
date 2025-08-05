package com.ekyc.moduleservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "modules", schema = "core")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Module {
  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
  private UUID id;

  @Column(unique = true, nullable = false)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false)
  private String category;

  @JdbcTypeCode(SqlTypes.JSON)
  private List<String> features;

  @Column(nullable = false, name = "monthly_price", precision = 10, scale = 2)
  private BigDecimal monthlyPrice;

  @Column(nullable = false, name = "yearly_price", precision = 10, scale = 2)
  private BigDecimal yearlyPrice;

  @Builder.Default
  private String status = "active";

  @Column(name = "created_at")
  @Builder.Default
  private OffsetDateTime createdAt = OffsetDateTime.now();

}
