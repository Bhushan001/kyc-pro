package com.saasplatform.moduleservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class CreateModuleRequest {

  @NotBlank
  private String name;

  private String description;

  @NotBlank
  private String category;

  private List<String> features;

  @NotNull
  private BigDecimal monthlyPrice;
  @NotNull
  private BigDecimal yearlyPrice;

  // getters and setters
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
}
