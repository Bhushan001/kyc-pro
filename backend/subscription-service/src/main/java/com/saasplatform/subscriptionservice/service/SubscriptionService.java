package com.saasplatform.subscriptionservice.service;

import com.saasplatform.subscriptionservice.dto.CreateSubscriptionRequest;
import com.saasplatform.subscriptionservice.dto.SubscriptionDto;
import com.saasplatform.subscriptionservice.entity.Subscription;
import com.saasplatform.subscriptionservice.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

  private final SubscriptionRepository repo;

  public SubscriptionService(SubscriptionRepository repo) {
    this.repo = repo;
  }

  public List<SubscriptionDto> getByTenantId(UUID tenantId) {
    return repo.findByTenantId(tenantId).stream().map(this::toDto).collect(Collectors.toList());
  }

  public List<SubscriptionDto> getByModuleId(UUID moduleId) {
    return repo.findByModuleId(moduleId).stream().map(this::toDto).collect(Collectors.toList());
  }

  public SubscriptionDto create(CreateSubscriptionRequest req) {
    Subscription sub = new Subscription();
    sub.setTenantId(req.getTenantId());
    sub.setModuleId(req.getModuleId());
    sub.setBillingCycle(req.getBillingCycle());
    sub.setStatus("active");
    sub.setPrice(req.getPrice());
    return toDto(repo.save(sub));
  }

  public void delete(UUID id) { repo.deleteById(id); }

  private SubscriptionDto toDto(Subscription s) {
    return new SubscriptionDto(
      s.getId(), s.getTenantId(), s.getModuleId(), s.getBillingCycle(),
      s.getStatus(), s.getPrice(), s.getSubscribedAt(), s.getExpiresAt()
    );
  }
}
