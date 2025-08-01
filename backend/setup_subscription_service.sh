#!/bin/bash
set -euo pipefail

SERVICE_ROOT="./subscription-service"
PKG_PATH="com/saasplatform/subscriptionservice"
echo "Creating $SERVICE_ROOT microservice structure ..."

mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/controller"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/entity"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/repository"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/service"
mkdir -p "$SERVICE_ROOT/src/main/resources"

# pom.xml
cat > "$SERVICE_ROOT/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
  </parent>
  <groupId>com.saasplatform</groupId>
  <artifactId>subscription-service</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>
  <name>subscription-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <version>42.5.0</version>
    </dependency>
    <dependency>
      <groupId>jakarta.validation</groupId>
      <artifactId>jakarta.validation-api</artifactId>
      <version>3.0.2</version>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
EOF

# application.yml
cat > "$SERVICE_ROOT/src/main/resources/application.yml" <<'EOF'
server:
  port: 8085

spring:
  application:
    name: subscription-service
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://postgres:5432/saas_platform}
    username: ${DATABASE_USERNAME:saas_user}
    password: ${DATABASE_PASSWORD:saas_password}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

management:
  endpoints:
    web:
      exposure:
        include: health,info
EOF

# Main application class
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/SubscriptionServiceApplication.java" <<'EOF'
package com.saasplatform.subscriptionservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SubscriptionServiceApplication {
  public static void main(String[] args) {
    SpringApplication.run(SubscriptionServiceApplication.class, args);
  }
}
EOF

# Entity: Subscription.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/entity/Subscription.java" <<'EOF'
package com.saasplatform.subscriptionservice.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscriptions", schema = "billing")
public class Subscription {
  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
  private UUID id;

  @Column(name = "tenant_id", nullable = false)
  private UUID tenantId;

  @Column(name = "module_id", nullable = false)
  private UUID moduleId;

  @Column(name = "billing_cycle", nullable = false)
  private String billingCycle;

  @Column(nullable = false)
  private String status = "active";

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @Column(name = "subscribed_at")
  private OffsetDateTime subscribedAt = OffsetDateTime.now();

  @Column(name = "expires_at")
  private OffsetDateTime expiresAt;

  // Getters and setters

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public UUID getTenantId() { return tenantId; }
  public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
  public UUID getModuleId() { return moduleId; }
  public void setModuleId(UUID moduleId) { this.moduleId = moduleId; }
  public String getBillingCycle() { return billingCycle; }
  public void setBillingCycle(String billingCycle) { this.billingCycle = billingCycle; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }
  public OffsetDateTime getSubscribedAt() { return subscribedAt; }
  public void setSubscribedAt(OffsetDateTime subscribedAt) { this.subscribedAt = subscribedAt; }
  public OffsetDateTime getExpiresAt() { return expiresAt; }
  public void setExpiresAt(OffsetDateTime expiresAt) { this.expiresAt = expiresAt; }
}
EOF

# DTO: SubscriptionDto.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto/SubscriptionDto.java" <<'EOF'
package com.saasplatform.subscriptionservice.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record SubscriptionDto(
  UUID id,
  UUID tenantId,
  UUID moduleId,
  String billingCycle,
  String status,
  BigDecimal price,
  OffsetDateTime subscribedAt,
  OffsetDateTime expiresAt
) {}
EOF

# DTO: CreateSubscriptionRequest.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto/CreateSubscriptionRequest.java" <<'EOF'
package com.saasplatform.subscriptionservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public class CreateSubscriptionRequest {
  @NotNull
  private UUID tenantId;
  @NotNull
  private UUID moduleId;
  @NotBlank
  private String billingCycle;
  @NotNull
  private BigDecimal price;

  // getters and setters
  public UUID getTenantId() { return tenantId; }
  public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
  public UUID getModuleId() { return moduleId; }
  public void setModuleId(UUID moduleId) { this.moduleId = moduleId; }
  public String getBillingCycle() { return billingCycle; }
  public void setBillingCycle(String billingCycle) { this.billingCycle = billingCycle; }
  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }
}
EOF

# Repository: SubscriptionRepository.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/repository/SubscriptionRepository.java" <<'EOF'
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
EOF

# Service: SubscriptionService.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/service/SubscriptionService.java" <<'EOF'
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
EOF

# Controller: SubscriptionController.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/controller/SubscriptionController.java" <<'EOF'
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
EOF

# Dockerfile
cat > "$SERVICE_ROOT/Dockerfile" <<'EOF'
FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
EOF

echo "✅ subscription-service scaffold complete in $SERVICE_ROOT"
