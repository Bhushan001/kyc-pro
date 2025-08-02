package com.ekyc.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Shared Module DTO for all services
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ModuleDto {
    
    private UUID id;
    private String name;
    private String description;
    private String category;
    private List<String> features;
    private BigDecimal monthlyPrice;
    private BigDecimal yearlyPrice;
    private String status;
    private OffsetDateTime createdAt;
    
    public ModuleDto() {}
    
    public ModuleDto(UUID id, String name, String description, String category, 
                     List<String> features, BigDecimal monthlyPrice, BigDecimal yearlyPrice, String status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.features = features;
        this.monthlyPrice = monthlyPrice;
        this.yearlyPrice = yearlyPrice;
        this.status = status;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public List<String> getFeatures() {
        return features;
    }
    
    public void setFeatures(List<String> features) {
        this.features = features;
    }
    
    public BigDecimal getMonthlyPrice() {
        return monthlyPrice;
    }
    
    public void setMonthlyPrice(BigDecimal monthlyPrice) {
        this.monthlyPrice = monthlyPrice;
    }
    
    public BigDecimal getYearlyPrice() {
        return yearlyPrice;
    }
    
    public void setYearlyPrice(BigDecimal yearlyPrice) {
        this.yearlyPrice = yearlyPrice;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    /**
     * Check if module is active
     */
    public boolean isActive() {
        return "active".equals(status);
    }
    
    /**
     * Check if module has a specific feature
     */
    public boolean hasFeature(String feature) {
        return features != null && features.contains(feature);
    }
    
    /**
     * Get price based on billing cycle
     */
    public BigDecimal getPrice(String billingCycle) {
        if ("yearly".equals(billingCycle)) {
            return yearlyPrice;
        }
        return monthlyPrice;
    }
} 