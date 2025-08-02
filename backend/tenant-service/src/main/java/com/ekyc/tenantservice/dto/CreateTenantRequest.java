package com.ekyc.tenantservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.Map;

public class CreateTenantRequest {

    @NotBlank(message = "Tenant name is required")
    private String name;

    @NotBlank(message = "Domain is required")
    @Pattern(regexp = "^[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Invalid domain format")
    private String domain;

    private String plan = "basic";

    private Map<String, Object> settings;
    private Map<String, Object> branding;

    // Getters and setters

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public Map<String, Object> getSettings() { return settings; }
    public void setSettings(Map<String, Object> settings) { this.settings = settings; }

    public Map<String, Object> getBranding() { return branding; }
    public void setBranding(Map<String, Object> branding) { this.branding = branding; }
}
