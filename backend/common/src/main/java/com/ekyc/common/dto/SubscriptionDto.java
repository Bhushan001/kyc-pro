package com.ekyc.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Shared Subscription DTO for all services
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubscriptionDto {
    
    private UUID id;
    private UUID tenantId;
    private UUID moduleId;
    private String billingCycle;
    private String status;
    private BigDecimal price;
    private OffsetDateTime subscribedAt;
    private OffsetDateTime expiresAt;
    
    // Additional fields for joined data
    private TenantDto tenant;
    private ModuleDto module;
    
    public SubscriptionDto() {}
    
    public SubscriptionDto(UUID id, UUID tenantId, UUID moduleId, String billingCycle, 
                          String status, BigDecimal price) {
        this.id = id;
        this.tenantId = tenantId;
        this.moduleId = moduleId;
        this.billingCycle = billingCycle;
        this.status = status;
        this.price = price;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public UUID getTenantId() {
        return tenantId;
    }
    
    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }
    
    public UUID getModuleId() {
        return moduleId;
    }
    
    public void setModuleId(UUID moduleId) {
        this.moduleId = moduleId;
    }
    
    public String getBillingCycle() {
        return billingCycle;
    }
    
    public void setBillingCycle(String billingCycle) {
        this.billingCycle = billingCycle;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public OffsetDateTime getSubscribedAt() {
        return subscribedAt;
    }
    
    public void setSubscribedAt(OffsetDateTime subscribedAt) {
        this.subscribedAt = subscribedAt;
    }
    
    public OffsetDateTime getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(OffsetDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public TenantDto getTenant() {
        return tenant;
    }
    
    public void setTenant(TenantDto tenant) {
        this.tenant = tenant;
    }
    
    public ModuleDto getModule() {
        return module;
    }
    
    public void setModule(ModuleDto module) {
        this.module = module;
    }
    
    /**
     * Check if subscription is active
     */
    public boolean isActive() {
        return "active".equals(status);
    }
    
    /**
     * Check if subscription is expired
     */
    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(OffsetDateTime.now());
    }
    
    /**
     * Check if subscription is monthly
     */
    public boolean isMonthly() {
        return "monthly".equals(billingCycle);
    }
    
    /**
     * Check if subscription is yearly
     */
    public boolean isYearly() {
        return "yearly".equals(billingCycle);
    }
    
    /**
     * Check if subscription will expire soon (within 30 days)
     */
    public boolean isExpiringSoon() {
        if (expiresAt == null) {
            return false;
        }
        OffsetDateTime thirtyDaysFromNow = OffsetDateTime.now().plusDays(30);
        return expiresAt.isBefore(thirtyDaysFromNow);
    }
} 