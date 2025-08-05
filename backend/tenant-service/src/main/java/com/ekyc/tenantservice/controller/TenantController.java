package com.ekyc.tenantservice.controller;

import com.ekyc.tenantservice.dto.CreateTenantRequest;
import com.ekyc.tenantservice.dto.TenantDto;
import com.ekyc.tenantservice.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tenants")
@Slf4j
@RequiredArgsConstructor
public class TenantController {
  
  private final TenantService service;

  @PostMapping
  public ResponseEntity<TenantDto> createTenant(@Valid @RequestBody CreateTenantRequest req) {
    log.info("Creating tenant with domain: {}", req.getDomain());
    try {
      TenantDto tenant = service.createTenant(req);
      return ResponseEntity.status(HttpStatus.CREATED).body(tenant);
    } catch (RuntimeException e) {
      log.error("Error creating tenant: {}", e.getMessage());
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping
  public ResponseEntity<List<TenantDto>> getAllTenants() {
    log.info("Fetching all tenants");
    List<TenantDto> tenants = service.getAllTenants();
    return ResponseEntity.ok(tenants);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TenantDto> getTenantById(@PathVariable UUID id) {
    log.info("Fetching tenant by id: {}", id);
    TenantDto tenant = service.getTenantById(id);
    if (tenant != null) {
      return ResponseEntity.ok(tenant);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<TenantDto> updateTenant(@PathVariable UUID id, @Valid @RequestBody CreateTenantRequest req) {
    log.info("Updating tenant with id: {}", id);
    try {
      TenantDto tenant = service.updateTenant(id, req);
      return ResponseEntity.ok(tenant);
    } catch (RuntimeException e) {
      log.error("Error updating tenant: {}", e.getMessage());
      return ResponseEntity.badRequest().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTenant(@PathVariable UUID id) {
    log.info("Deleting tenant with id: {}", id);
    try {
      service.deleteTenant(id);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      log.error("Error deleting tenant: {}", e.getMessage());
      return ResponseEntity.badRequest().build();
    }
  }
}
