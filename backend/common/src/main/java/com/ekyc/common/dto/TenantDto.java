package com.ekyc.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Shared Tenant DTO for all services
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TenantDto {
    
    private UUID id;
    private String name;
    private String domain;
    private String plan;
    private String status;
    private Map<String, Object> settings;
    private Map<String, Object> branding;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    public TenantDto() {}
    
    public TenantDto(UUID id, String name, String domain, String plan, String status) {
        this.id = id;
        this.name = name;
        this.domain = domain;
        this.plan = plan;
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
    
    public String getDomain() {
        return domain;
    }
    
    public void setDomain(String domain) {
        this.domain = domain;
    }
    
    public String getPlan() {
        return plan;
    }
    
    public void setPlan(String plan) {
        this.plan = plan;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Map<String, Object> getSettings() {
        return settings;
    }
    
    public void setSettings(Map<String, Object> settings) {
        this.settings = settings;
    }
    
    public Map<String, Object> getBranding() {
        return branding;
    }
    
    public void setBranding(Map<String, Object> branding) {
        this.branding = branding;
    }
    
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    /**
     * Check if tenant is active
     */
    public boolean isActive() {
        return "active".equals(status);
    }
    
    /**
     * Check if tenant is on basic plan
     */
    public boolean isBasicPlan() {
        return "basic".equals(plan);
    }
    
    /**
     * Check if tenant is on business plan
     */
    public boolean isBusinessPlan() {
        return "business".equals(plan);
    }
    
    /**
     * Check if tenant is on enterprise plan
     */
    public boolean isEnterprisePlan() {
        return "enterprise".equals(plan);
    }
} 