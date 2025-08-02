package com.ekyc.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Shared DTO with common fields and methods used across all services
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SharedDto {
    
    private UUID id;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    // For audit fields (not serialized in responses)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String createdBy;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String updatedBy;
    
    public SharedDto() {}
    
    public SharedDto(UUID id, String status) {
        this.id = id;
        this.status = status;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
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
    
    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public String getUpdatedBy() {
        return updatedBy;
    }
    
    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
    
    /**
     * Check if entity is active
     */
    public boolean isActive() {
        return "active".equals(status);
    }
    
    /**
     * Check if entity is inactive
     */
    public boolean isInactive() {
        return "inactive".equals(status);
    }
    
    /**
     * Check if entity is deleted
     */
    public boolean isDeleted() {
        return "deleted".equals(status);
    }
    
    /**
     * Check if entity is pending
     */
    public boolean isPending() {
        return "pending".equals(status);
    }
    
    /**
     * Check if entity is suspended
     */
    public boolean isSuspended() {
        return "suspended".equals(status);
    }
    
    /**
     * Get age of entity in days
     */
    public long getAgeInDays() {
        if (createdAt == null) {
            return 0;
        }
        return java.time.Duration.between(createdAt, OffsetDateTime.now()).toDays();
    }
    
    /**
     * Get time since last update in hours
     */
    public long getHoursSinceUpdate() {
        if (updatedAt == null) {
            return 0;
        }
        return java.time.Duration.between(updatedAt, OffsetDateTime.now()).toHours();
    }
    
    /**
     * Check if entity was created recently (within specified days)
     */
    public boolean isCreatedRecently(int days) {
        return getAgeInDays() <= days;
    }
    
    /**
     * Check if entity was updated recently (within specified hours)
     */
    public boolean isUpdatedRecently(int hours) {
        return getHoursSinceUpdate() <= hours;
    }
}
