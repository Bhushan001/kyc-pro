package com.saasplatform.tenantservice.service;

import com.saasplatform.tenantservice.dto.CreateTenantRequest;
import com.saasplatform.tenantservice.dto.TenantDto;
import com.saasplatform.tenantservice.entity.Tenant;
import com.saasplatform.tenantservice.repository.TenantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TenantService {

    private final TenantRepository repository;

    public TenantService(TenantRepository repository) {
        this.repository = repository;
    }

    public List<TenantDto> getAllTenants() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public TenantDto getTenantById(UUID id) {
        return repository.findById(id).map(this::toDto).orElse(null);
    }

    public TenantDto createTenant(CreateTenantRequest request) {
        if (repository.findByDomain(request.getDomain()).isPresent()) {
            throw new RuntimeException("Domain already exists");
        }

        Tenant tenant = new Tenant();
        tenant.setName(request.getName());
        tenant.setDomain(request.getDomain());
        tenant.setPlan(request.getPlan());
        tenant.setSettings(request.getSettings());
        tenant.setBranding(request.getBranding());
        tenant = repository.save(tenant);
        return toDto(tenant);
    }

    public TenantDto updateTenant(UUID id, CreateTenantRequest request) {
        Tenant tenant = repository.findById(id).orElseThrow(() -> new RuntimeException("Tenant not found"));

        if (!tenant.getDomain().equals(request.getDomain()) && repository.findByDomain(request.getDomain()).isPresent()) {
            throw new RuntimeException("Domain already exists");
        }

        tenant.setName(request.getName());
        tenant.setDomain(request.getDomain());
        tenant.setPlan(request.getPlan());
        tenant.setSettings(request.getSettings());
        tenant.setBranding(request.getBranding());
        tenant = repository.save(tenant);
        return toDto(tenant);
    }

    public void deleteTenant(UUID id) {
        repository.deleteById(id);
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
