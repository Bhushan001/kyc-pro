package com.saasplatform.subscriptionservice.repository;

import com.saasplatform.subscriptionservice.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
  List<Subscription> findByTenantId(UUID tenantId);
  List<Subscription> findByModuleId(UUID moduleId);
  Optional<Subscription> findByTenantIdAndModuleId(UUID tenantId, UUID moduleId);
}
