package com.saasplatform.subscriptionservice.controller;

import com.saasplatform.subscriptionservice.dto.CreateSubscriptionRequest;
import com.saasplatform.subscriptionservice.dto.SubscriptionDto;
import com.saasplatform.subscriptionservice.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

  private final SubscriptionService service;

  public SubscriptionController(SubscriptionService service) {
    this.service = service;
  }

  @GetMapping("/tenant/{tenantId}")
  public ResponseEntity<List<SubscriptionDto>> getByTenantId(@PathVariable UUID tenantId) {
    return ResponseEntity.ok(service.getByTenantId(tenantId));
  }

  @GetMapping("/module/{moduleId}")
  public ResponseEntity<List<SubscriptionDto>> getByModuleId(@PathVariable UUID moduleId) {
    return ResponseEntity.ok(service.getByModuleId(moduleId));
  }

  @PostMapping
  public ResponseEntity<SubscriptionDto> create(@Valid @RequestBody CreateSubscriptionRequest req) {
    return ResponseEntity.ok(service.create(req));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
