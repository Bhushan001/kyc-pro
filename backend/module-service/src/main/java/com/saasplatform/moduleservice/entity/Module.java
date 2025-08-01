package com.saasplatform.moduleservice.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "modules", schema = "core")
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

  private String status = "active";

  @Column(name = "created_at")
  private OffsetDateTime createdAt = OffsetDateTime.now();

  // Getters and Setters

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }

  public List<String> getFeatures() { return features; }
  public void setFeatures(List<String> features) { this.features = features; }

  public BigDecimal getMonthlyPrice() { return monthlyPrice; }
  public void setMonthlyPrice(BigDecimal monthlyPrice) { this.monthlyPrice = monthlyPrice; }

  public BigDecimal getYearlyPrice() { return yearlyPrice; }
  public void setYearlyPrice(BigDecimal yearlyPrice) { this.yearlyPrice = yearlyPrice; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
