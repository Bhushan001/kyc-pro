package com.ekyc.tenantservice.service;

import com.ekyc.tenantservice.dto.CreateTenantRequest;
import com.ekyc.tenantservice.dto.TenantDto;
import com.ekyc.tenantservice.entity.Tenant;
import com.ekyc.tenantservice.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository repository;

    public List<TenantDto> getAllTenants() {
        log.info("Fetching all tenants");
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public TenantDto getTenantById(UUID id) {
        log.info("Fetching tenant by id: {}", id);
        return repository.findById(id).map(this::toDto).orElse(null);
    }

    public TenantDto createTenant(CreateTenantRequest request) {
        log.info("Creating tenant with domain: {}", request.getDomain());
        
        if (repository.findByDomain(request.getDomain()).isPresent()) {
            throw new RuntimeException("Domain already exists");
        }

        Tenant tenant = Tenant.builder()
                .name(request.getName())
                .domain(request.getDomain())
                .plan(request.getPlan())
                .settings(request.getSettings())
                .branding(request.getBranding())
                .build();
        
        tenant = repository.save(tenant);
        log.info("Tenant created successfully with id: {}", tenant.getId());
        return toDto(tenant);
    }

    public TenantDto updateTenant(UUID id, CreateTenantRequest request) {
        log.info("Updating tenant with id: {}", id);
        
        Tenant tenant = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        if (!tenant.getDomain().equals(request.getDomain()) && 
            repository.findByDomain(request.getDomain()).isPresent()) {
            throw new RuntimeException("Domain already exists");
        }

        tenant.setName(request.getName());
        tenant.setDomain(request.getDomain());
        tenant.setPlan(request.getPlan());
        tenant.setSettings(request.getSettings());
        tenant.setBranding(request.getBranding());
        
        tenant = repository.save(tenant);
        log.info("Tenant updated successfully with id: {}", tenant.getId());
        return toDto(tenant);
    }

    public void deleteTenant(UUID id) {
        log.info("Deleting tenant with id: {}", id);
        repository.deleteById(id);
        log.info("Tenant deleted successfully");
    }

    private TenantDto toDto(Tenant tenant) {
        return new TenantDto(
            tenant.getId(),
            tenant.getName(),
            tenant.getDomain(),
            tenant.getStatus(),
            tenant.getPlan(),
            tenant.getSettings(),
            tenant.getBranding()
        );
    }
}
