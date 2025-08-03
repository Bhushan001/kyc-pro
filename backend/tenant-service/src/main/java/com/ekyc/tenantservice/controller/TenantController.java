package com.ekyc.tenantservice.controller;

import com.ekyc.tenantservice.dto.CreateTenantRequest;
import com.ekyc.tenantservice.dto.TenantDto;
import com.ekyc.tenantservice.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {
  private final TenantService service;
  public TenantController(TenantService service) { this.service = service; }

  @PostMapping
  public ResponseEntity<TenantDto> createTenant(@Valid @RequestBody CreateTenantRequest req) {
    return ResponseEntity.ok(service.createTenant(req));
  }

  @GetMapping
  public ResponseEntity<List<TenantDto>> getAllTenants() {
    return ResponseEntity.ok(service.getAllTenants());
  }

  @GetMapping("/{id}")
  public ResponseEntity<TenantDto> getTenantById(@PathVariable UUID id) {
    return ResponseEntity.ok(service.getTenantById(id));
  }
}
