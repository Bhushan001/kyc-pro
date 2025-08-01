#!/bin/bash
set -euo pipefail

SERVICE_ROOT="./module-service"
PKG_PATH="com/saasplatform/moduleservice"
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
  <artifactId>module-service</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>
  <name>module-service</name>
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
  port: 8084

spring:
  application:
    name: module-service
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
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/ModuleServiceApplication.java" <<'EOF'
package com.saasplatform.moduleservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ModuleServiceApplication {
  public static void main(String[] args) {
    SpringApplication.run(ModuleServiceApplication.class, args);
  }
}
EOF

# Entity: Module.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/entity/Module.java" <<'EOF'
package com.saasplatform.moduleservice.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "modules", schema = "core")
public class Module {
  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
  private UUID id;

  @Column(unique = true, nullable = false)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false)
  private String category;

  @JdbcTypeCode(SqlTypes.JSON)
  private List<String> features;

  @Column(nullable = false, name = "monthly_price", precision = 10, scale = 2)
  private BigDecimal monthlyPrice;

  @Column(nullable = false, name = "yearly_price", precision = 10, scale = 2)
  private BigDecimal yearlyPrice;

  private String status = "active";

  @Column(name = "created_at")
  private OffsetDateTime createdAt = OffsetDateTime.now();

  // Getters and Setters

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }

  public List<String> getFeatures() { return features; }
  public void setFeatures(List<String> features) { this.features = features; }

  public BigDecimal getMonthlyPrice() { return monthlyPrice; }
  public void setMonthlyPrice(BigDecimal monthlyPrice) { this.monthlyPrice = monthlyPrice; }

  public BigDecimal getYearlyPrice() { return yearlyPrice; }
  public void setYearlyPrice(BigDecimal yearlyPrice) { this.yearlyPrice = yearlyPrice; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
EOF

# DTO: ModuleDto.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto/ModuleDto.java" <<'EOF'
package com.saasplatform.moduleservice.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ModuleDto(
    UUID id,
    String name,
    String description,
    String category,
    List<String> features,
    BigDecimal monthlyPrice,
    BigDecimal yearlyPrice,
    String status
) {}
EOF

# DTO: CreateModuleRequest.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto/CreateModuleRequest.java" <<'EOF'
package com.saasplatform.moduleservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class CreateModuleRequest {

  @NotBlank
  private String name;

  private String description;

  @NotBlank
  private String category;

  private List<String> features;

  @NotNull
  private BigDecimal monthlyPrice;
  @NotNull
  private BigDecimal yearlyPrice;

  // getters and setters
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }
  public List<String> getFeatures() { return features; }
  public void setFeatures(List<String> features) { this.features = features; }
  public BigDecimal getMonthlyPrice() { return monthlyPrice; }
  public void setMonthlyPrice(BigDecimal monthlyPrice) { this.monthlyPrice = monthlyPrice; }
  public BigDecimal getYearlyPrice() { return yearlyPrice; }
  public void setYearlyPrice(BigDecimal yearlyPrice) { this.yearlyPrice = yearlyPrice; }
}
EOF

# Repository: ModuleRepository.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/repository/ModuleRepository.java" <<'EOF'
package com.saasplatform.moduleservice.repository;

import com.saasplatform.moduleservice.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ModuleRepository extends JpaRepository<Module, UUID> {
  List<Module> findByStatus(String status);
  List<Module> findByCategoryAndStatus(String category, String status);
  Optional<Module> findByName(String name);
}
EOF

# Service: ModuleService.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/service/ModuleService.java" <<'EOF'
package com.saasplatform.moduleservice.service;

import com.saasplatform.moduleservice.dto.CreateModuleRequest;
import com.saasplatform.moduleservice.dto.ModuleDto;
import com.saasplatform.moduleservice.entity.Module;
import com.saasplatform.moduleservice.repository.ModuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ModuleService {

  private final ModuleRepository repo;

  public ModuleService(ModuleRepository repo) {
    this.repo = repo;
  }

  public List<ModuleDto> getActiveModules() {
    return repo.findByStatus("active").stream().map(this::toDto).collect(Collectors.toList());
  }

  public List<ModuleDto> getModulesByCategory(String category) {
    return repo.findByCategoryAndStatus(category, "active").stream().map(this::toDto).collect(Collectors.toList());
  }

  public ModuleDto create(CreateModuleRequest req) {
    Module m = new Module();
    m.setName(req.getName());
    m.setDescription(req.getDescription());
    m.setCategory(req.getCategory());
    m.setFeatures(req.getFeatures());
    m.setMonthlyPrice(req.getMonthlyPrice());
    m.setYearlyPrice(req.getYearlyPrice());
    m.setStatus("active");
    return toDto(repo.save(m));
  }

  public void delete(UUID id) { repo.deleteById(id); }

  private ModuleDto toDto(Module m) {
    return new ModuleDto(
      m.getId(), m.getName(), m.getDescription(), m.getCategory(),
      m.getFeatures(), m.getMonthlyPrice(), m.getYearlyPrice(), m.getStatus()
    );
  }
}
EOF

# Controller: ModuleController.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/controller/ModuleController.java" <<'EOF'
package com.saasplatform.moduleservice.controller;

import com.saasplatform.moduleservice.dto.CreateModuleRequest;
import com.saasplatform.moduleservice.dto.ModuleDto;
import com.saasplatform.moduleservice.service.ModuleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "*")
public class ModuleController {

  private final ModuleService service;

  public ModuleController(ModuleService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<ModuleDto>> getActiveModules() {
    return ResponseEntity.ok(service.getActiveModules());
  }

  @GetMapping("/category/{category}")
  public ResponseEntity<List<ModuleDto>> getModulesByCategory(@PathVariable String category) {
    return ResponseEntity.ok(service.getModulesByCategory(category));
  }

  @PostMapping
  public ResponseEntity<ModuleDto> createModule(@Valid @RequestBody CreateModuleRequest request) {
    return ResponseEntity.ok(service.create(request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteModule(@PathVariable UUID id) {
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

echo "✅ module-service scaffold complete in $SERVICE_ROOT"
