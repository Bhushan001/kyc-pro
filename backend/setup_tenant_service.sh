#!/bin/bash
set -euo pipefail

SERVICE_ROOT="./tenant-service"
PKG_PATH="com/saasplatform/tenantservice"

echo "Creating $SERVICE_ROOT microservice structure ..."

# Create directory structure
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/controller"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/entity"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/repository"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/service"
mkdir -p "$SERVICE_ROOT/src/main/resources"

# pom.xml
cat > "$SERVICE_ROOT/pom.xml" << 'EOF'
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
  <artifactId>tenant-service</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <name>tenant-service</name>

  <properties>
    <java.version>17</java.version>
  </properties>

  <dependencies>
    <!-- Spring Boot Web -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Data JPA -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- PostgreSQL Driver -->
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <version>42.5.0</version>
    </dependency>

    <!-- Validation API -->
    <dependency>
      <groupId>jakarta.validation</groupId>
      <artifactId>jakarta.validation-api</artifactId>
      <version>3.0.2</version>
    </dependency>

    <!-- Actuator -->
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
cat > "$SERVICE_ROOT/src/main/resources/application.yml" << 'EOF'
server:
  port: 8082

spring:
  application:
    name: tenant-service
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

logging:
  level:
    com.saasplatform.tenantservice: DEBUG
EOF

# Main Application class
mkdir -p "$SERVICE_ROOT/src/main/java/com/saasplatform/tenantservice"
cat > "$SERVICE_ROOT/src/main/java/com/saasplatform/tenantservice/TenantServiceApplication.java" << 'EOF'
package com.saasplatform.tenantservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TenantServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TenantServiceApplication.class, args);
    }
}
EOF

# Entity: Tenant.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/entity/Tenant.java" << 'EOF'
package com.saasplatform.tenantservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "tenants", schema = "core")
public class Tenant {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @NotBlank
    private String name;

    @NotBlank
    @Column(unique = true)
    private String domain;

    @Column(nullable = false)
    private String status = "active";

    @Column(nullable = false)
    private String plan = "basic";

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> settings;

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> branding;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    // Getters and setters...

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() {return name;}
    public void setName(String name) { this.name = name; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public Map<String, Object> getSettings() { return settings; }
    public void setSettings(Map<String, Object> settings) { this.settings = settings; }

    public Map<String, Object> getBranding() { return branding; }
    public void setBranding(Map<String, Object> branding) { this.branding = branding; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
EOF

# DTO: CreateTenantRequest.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto/CreateTenantRequest.java" << 'EOF'
package com.saasplatform.tenantservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.Map;

public class CreateTenantRequest {

    @NotBlank(message = "Tenant name is required")
    private String name;

    @NotBlank(message = "Domain is required")
    @Pattern(regexp = "^[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Invalid domain format")
    private String domain;

    private String plan = "basic";

    private Map<String, Object> settings;
    private Map<String, Object> branding;

    // Getters and setters

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public Map<String, Object> getSettings() { return settings; }
    public void setSettings(Map<String, Object> settings) { this.settings = settings; }

    public Map<String, Object> getBranding() { return branding; }
    public void setBranding(Map<String, Object> branding) { this.branding = branding; }
}
EOF

# DTO: TenantDto.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto/TenantDto.java" << 'EOF'
package com.saasplatform.tenantservice.dto;

import java.util.Map;
import java.util.UUID;

public record TenantDto(
    UUID id,
    String name,
    String domain,
    String status,
    String plan,
    Map<String, Object> settings,
    Map<String, Object> branding
) {}
EOF

# Repository: TenantRepository.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/repository/TenantRepository.java" << 'EOF'
package com.saasplatform.tenantservice.repository;

import com.saasplatform.tenantservice.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    Optional<Tenant> findByDomain(String domain);
}
EOF

# Service: TenantService.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/service/TenantService.java" << 'EOF'
package com.saasplatform.tenantservice.service;

import com.saasplatform.tenantservice.dto.CreateTenantRequest;
import com.saasplatform.tenantservice.dto.TenantDto;
import com.saasplatform.tenantservice.entity.Tenant;
import com.saasplatform.tenantservice.repository.TenantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TenantService {

    private final TenantRepository repository;

    public TenantService(TenantRepository repository) {
        this.repository = repository;
    }

    public List<TenantDto> getAllTenants() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public TenantDto getTenantById(UUID id) {
        return repository.findById(id).map(this::toDto).orElse(null);
    }

    public TenantDto createTenant(CreateTenantRequest request) {
        if (repository.findByDomain(request.getDomain()).isPresent()) {
            throw new RuntimeException("Domain already exists");
        }

        Tenant tenant = new Tenant();
        tenant.setName(request.getName());
        tenant.setDomain(request.getDomain());
        tenant.setPlan(request.getPlan());
        tenant.setSettings(request.getSettings());
        tenant.setBranding(request.getBranding());
        tenant = repository.save(tenant);
        return toDto(tenant);
    }

    public TenantDto updateTenant(UUID id, CreateTenantRequest request) {
        Tenant tenant = repository.findById(id).orElseThrow(() -> new RuntimeException("Tenant not found"));

        if (!tenant.getDomain().equals(request.getDomain()) && repository.findByDomain(request.getDomain()).isPresent()) {
            throw new RuntimeException("Domain already exists");
        }

        tenant.setName(request.getName());
        tenant.setDomain(request.getDomain());
        tenant.setPlan(request.getPlan());
        tenant.setSettings(request.getSettings());
        tenant.setBranding(request.getBranding());
        tenant = repository.save(tenant);
        return toDto(tenant);
    }

    public void deleteTenant(UUID id) {
        repository.deleteById(id);
    }

    private TenantDto toDto(Tenant tenant) {
        return new TenantDto(
            tenant.getId(),
            tenant.getName(),
            tenant.getDomain(),
            tenant.getStatus(),
            tenant.getPlan(),
            tenant.getSettings(),
            tenant.getBranding()
        );
    }
}
EOF

# Controller: TenantController.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/controller/TenantController.java" << 'EOF'
package com.saasplatform.tenantservice.controller;

import com.saasplatform.tenantservice.dto.CreateTenantRequest;
import com.saasplatform.tenantservice.dto.TenantDto;
import com.saasplatform.tenantservice.service.TenantService;
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
EOF

# Dockerfile
cat > "$SERVICE_ROOT/Dockerfile" << 'EOF'
FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
EOF

echo "✅ tenant-service scaffold complete in $SERVICE_ROOT"
