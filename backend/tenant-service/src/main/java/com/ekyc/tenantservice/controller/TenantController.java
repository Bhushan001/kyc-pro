package com.ekyc.tenantservice.controller;

import com.ekyc.tenantservice.dto.CreateTenantRequest;
import com.ekyc.tenantservice.dto.TenantResponse;
import com.ekyc.tenantservice.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {
  private final TenantService service;
  public TenantController(TenantService service) { this.service = service; }

  @PostMapping
  public ResponseEntity<TenantResponse> createTenant(@Valid @RequestBody CreateTenantRequest req) {
    return ResponseEntity.ok(service.createTenant(req));
  }

  @GetMapping
  public ResponseEntity<List<TenantResponse>> getAllTenants() {
    return ResponseEntity.ok(service.getAllTenants());
  }

  @GetMapping("/{id}")
  public ResponseEntity<TenantResponse> getTenantById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getTenantById(id));
  }
}
