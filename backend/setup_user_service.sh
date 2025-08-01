#!/bin/bash
set -euo pipefail

SERVICE_ROOT="./user-service"
PKG_PATH="com/saasplatform/userservice"

echo "Creating $SERVICE_ROOT microservice structure ..."

# Creating directories
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/controller"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/entity"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/repository"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/service"
mkdir -p "$SERVICE_ROOT/src/main/resources"

# pom.xml
cat > "$SERVICE_ROOT/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
             http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <groupId>com.saasplatform</groupId>
    <artifactId>user-service</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>User Service</name>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

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
cat > "$SERVICE_ROOT/src/main/resources/application.yml" <<'EOF'
server:
  port: 8083

spring:
  application:
    name: user-service
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
    com.saasplatform.userservice: DEBUG
EOF

# Main Application Class
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/UserServiceApplication.java" <<'EOF'
package com.saasplatform.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
EOF

# Entity: User.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/entity/User.java" <<'EOF'
package com.saasplatform.userservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.GenericGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users", schema = "auth")
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @NotBlank
    private String name;

    @NotBlank
    private String role;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(nullable = false)
    private String status = "active";

    @Column(name = "last_login")
    private OffsetDateTime lastLogin;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    // Getters and Setters ...

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(OffsetDateTime lastLogin) { this.lastLogin = lastLogin; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
EOF

# DTO: UserDto.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto/UserDto.java" <<'EOF'
package com.saasplatform.userservice.dto;

import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String name,
        String role,
        UUID tenantId,
        String status
) {}
EOF

# DTO: CreateUserRequest.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto/CreateUserRequest.java" <<'EOF'
package com.saasplatform.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateUserRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    @NotBlank
    private String name;

    @NotBlank
    private String role;

    private UUID tenantId;

    // Getters and setters

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
}
EOF

# Repository: UserRepository.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/repository/UserRepository.java" <<'EOF'
package com.saasplatform.userservice.repository;

import com.saasplatform.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    List<User> findAllByTenantId(UUID tenantId);
}
EOF

# Service: UserService.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/service/UserService.java" <<'EOF'
package com.saasplatform.userservice.service;

import com.saasplatform.userservice.dto.CreateUserRequest;
import com.saasplatform.userservice.dto.UserDto;
import com.saasplatform.userservice.entity.User;
import com.saasplatform.userservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDto> getUsersByTenant(UUID tenantId) {
        return repository.findAllByTenantId(tenantId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(UUID id) {
        return repository.findById(id).map(this::toDto).orElse(null);
    }

    public UserDto createUser(CreateUserRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(request.getRole());
        user.setTenantId(request.getTenantId());
        user.setStatus("active");
        user = repository.save(user);
        return toDto(user);
    }

    public void deleteUserById(UUID id) {
        repository.deleteById(id);
    }

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getTenantId(),
                user.getStatus()
        );
    }
}
EOF

# Controller: UserController.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/controller/UserController.java" <<'EOF'
package com.saasplatform.userservice.controller;

import com.saasplatform.userservice.dto.CreateUserRequest;
import com.saasplatform.userservice.dto.UserDto;
import com.saasplatform.userservice.service.UserService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<UserDto>> getUsersByTenant(@PathVariable UUID tenantId) {
        List<UserDto> users = service.getUsersByTenant(tenantId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {
        UserDto user = service.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto created = service.createUser(request);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        service.deleteUserById(id);
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

echo "✅ user-service scaffold complete in $SERVICE_ROOT"
