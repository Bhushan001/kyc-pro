package com.ekyc.subscriptionservice.controller;

import com.ekyc.subscriptionservice.dto.CreateSubscriptionRequest;
import com.ekyc.subscriptionservice.dto.SubscriptionResponse;
import com.ekyc.subscriptionservice.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
  private final SubscriptionService service;
  public SubscriptionController(SubscriptionService service) { this.service = service; }

  @PostMapping
  public ResponseEntity<SubscriptionResponse> createSubscription(@Valid @RequestBody CreateSubscriptionRequest req) {
    return ResponseEntity.ok(service.createSubscription(req));
  }

  @GetMapping
  public ResponseEntity<List<SubscriptionResponse>> getAllSubscriptions() {
    return ResponseEntity.ok(service.getAllSubscriptions());
  }

  @GetMapping("/{id}")
  public ResponseEntity<SubscriptionResponse> getSubscriptionById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getSubscriptionById(id));
  }
}
