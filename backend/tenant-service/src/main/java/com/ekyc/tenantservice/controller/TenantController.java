package com.ekyc.tenantservice.controller;

import com.ekyc.tenantservice.dto.CreateTenantRequest;
import com.ekyc.tenantservice.dto.TenantDto;
import com.ekyc.tenantservice.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin(origins = "*")
public class TenantController {

    private final TenantService service;

    public TenantController(TenantService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TenantDto>> getAllTenants() {
        return ResponseEntity.ok(service.getAllTenants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenantDto> getTenantById(@PathVariable UUID id) {
        TenantDto tenant = service.getTenantById(id);
        if (tenant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tenant);
    }

    @PostMapping
    public ResponseEntity<TenantDto> createTenant(@Valid @RequestBody CreateTenantRequest request) {
        try {
            TenantDto tenant = service.createTenant(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(tenant);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TenantDto> updateTenant(@PathVariable UUID id, @Valid @RequestBody CreateTenantRequest request) {
        try {
            TenantDto tenant = service.updateTenant(id, request);
            return ResponseEntity.ok(tenant);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTenant(@PathVariable UUID id) {
        service.deleteTenant(id);
        return ResponseEntity.noContent().build();
    }
}
