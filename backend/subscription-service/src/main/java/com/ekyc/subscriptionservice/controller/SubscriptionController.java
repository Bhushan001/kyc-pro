package com.ekyc.subscriptionservice.controller;

import com.ekyc.subscriptionservice.dto.CreateSubscriptionRequest;
import com.ekyc.subscriptionservice.dto.SubscriptionDto;
import com.ekyc.subscriptionservice.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
@Slf4j
@RequiredArgsConstructor
public class SubscriptionController {
  private final SubscriptionService service;

  @PostMapping
  public ResponseEntity<SubscriptionDto> createSubscription(@Valid @RequestBody CreateSubscriptionRequest req) {
    return ResponseEntity.ok(service.create(req));
  }

  @GetMapping
  public ResponseEntity<List<SubscriptionDto>> getAllSubscriptions() {
    return ResponseEntity.ok(service.getAllSubscriptions());
  }

  @GetMapping("/{id}")
  public ResponseEntity<SubscriptionDto> getSubscriptionById(@PathVariable UUID id) {
    return ResponseEntity.ok(service.getSubscriptionById(id));
  }
}
