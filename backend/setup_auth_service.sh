#!/bin/bash
set -euo pipefail

SERVICE_ROOT="./auth-service"
PKG_PATH="com/saasplatform/authservice"
echo "Creating $SERVICE_ROOT microservice structure ..."

mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/controller"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/entity"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/repository"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/service"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/util"
mkdir -p "$SERVICE_ROOT/src/main/java/$PKG_PATH/config"
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
  <artifactId>auth-service</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>
  <name>auth-service</name>
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
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-api</artifactId>
      <version>0.12.3</version>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-impl</artifactId>
      <version>0.12.3</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-jackson</artifactId>
      <version>0.12.3</version>
      <scope>runtime</scope>
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
  port: 8081

spring:
  application:
    name: auth-service
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

jwt:
  secret: mySuperSecretKeyWhichShouldBeOverridden
  expiration: 86400 # in seconds (1 day)

management:
  endpoints:
    web:
      exposure:
        include: health,info
EOF

# Main application class
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/AuthServiceApplication.java" <<'EOF'
package com.saasplatform.authservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthServiceApplication {
  public static void main(String[] args) {
    SpringApplication.run(AuthServiceApplication.class, args);
  }
}
EOF

# Entity User.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/entity/User.java" <<'EOF'
package com.saasplatform.authservice.entity;

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
  @Column(unique = true)
  private String email;

  @NotBlank
  @Column(name = "password_hash")
  private String passwordHash;

  @NotBlank
  private String name;

  @NotBlank
  private String role;

  @Column(name = "tenant_id")
  private UUID tenantId;

  private String status = "active";

  @Column(name = "last_login")
  private OffsetDateTime lastLogin;

  @Column(name = "created_at")
  private OffsetDateTime createdAt = OffsetDateTime.now();

  @Column(name = "updated_at")
  private OffsetDateTime updatedAt = OffsetDateTime.now();

  @PreUpdate
  public void preUpdate() { this.updatedAt = OffsetDateTime.now(); }

  // Getters and Setters omitted for brevity
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

# DTO LoginRequest.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto/LoginRequest.java" <<'EOF'
package com.saasplatform.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
  @Email
  @NotBlank
  private String email;

  @NotBlank
  private String password;

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
}
EOF

# DTO AuthResponse.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/dto/AuthResponse.java" <<'EOF'
package com.saasplatform.authservice.dto;

import java.util.UUID;

public class AuthResponse {
  private String token;
  private UUID userId;
  private String email;
  private String role;
  private UUID tenantId;

  public AuthResponse(String token, UUID userId, String email, String role, UUID tenantId) {
    this.token = token;
    this.userId = userId;
    this.email = email;
    this.role = role;
    this.tenantId = tenantId;
  }

  public String getToken() { return token; }
  public UUID getUserId() { return userId; }
  public String getEmail() { return email; }
  public String getRole() { return role; }
  public UUID getTenantId() { return tenantId; }
}
EOF

# Repository UserRepository.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/repository/UserRepository.java" <<'EOF'
package com.saasplatform.authservice.repository;

import com.saasplatform.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
  Optional<User> findByEmail(String email);
  Optional<User> findByEmailAndStatus(String email, String status);
}
EOF

# Jwt Util
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/util/JwtUtil.java" <<'EOF'
package com.saasplatform.authservice.util;

import com.saasplatform.authservice.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;

@Component
public class JwtUtil {
  @Value("${jwt.secret:secret}")
  private String secret;
  @Value("${jwt.expiration:86400}")
  private Long expiration;

  private SecretKey getSigningKey() { return Keys.hmacShaKeyFor(secret.getBytes()); }

  public String generateToken(User user) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("userId", user.getId().toString());
    claims.put("email", user.getEmail());
    claims.put("role", user.getRole());
    claims.put("tenantId", user.getTenantId() != null ? user.getTenantId().toString() : null);
    return Jwts.builder().setClaims(claims).setSubject(user.getEmail())
      .setIssuedAt(new Date(System.currentTimeMillis()))
      .setExpiration(new Date(System.currentTimeMillis() + expiration*1000))
      .signWith(getSigningKey(), SignatureAlgorithm.HS512).compact();
  }

  public boolean validateToken(String token) {
    try { Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token); return true; }
    catch (Exception e) { return false; }
  }

  public String getEmailFromToken(String token) {
    return getAllClaimsFromToken(token).getSubject();
  }
  public Claims getAllClaimsFromToken(String token) {
    return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
  }
}
EOF

# AuthService.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/service/AuthService.java" <<'EOF'
package com.saasplatform.authservice.service;

import com.saasplatform.authservice.dto.AuthResponse;
import com.saasplatform.authservice.dto.LoginRequest;
import com.saasplatform.authservice.entity.User;
import com.saasplatform.authservice.repository.UserRepository;
import com.saasplatform.authservice.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class AuthService {
  private final UserRepository repo;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  public AuthService(UserRepository repo, PasswordEncoder enc, JwtUtil jwt) {
    this.repo = repo;
    this.passwordEncoder = enc;
    this.jwtUtil = jwt;
  }

  public AuthResponse login(LoginRequest req) {
    User user = repo.findByEmailAndStatus(req.getEmail(), "active")
        .orElseThrow(() -> new RuntimeException("User not found or inactive"));
    if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash()))
      throw new RuntimeException("Invalid credentials");

    user.setLastLogin(OffsetDateTime.now());
    repo.save(user);

    String token = jwtUtil.generateToken(user);
    return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole(), user.getTenantId());
  }
}
EOF

# AuthController.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/controller/AuthController.java" <<'EOF'
package com.saasplatform.authservice.controller;

import com.saasplatform.authservice.dto.AuthResponse;
import com.saasplatform.authservice.dto.LoginRequest;
import com.saasplatform.authservice.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
  private final AuthService service;
  public AuthController(AuthService service) { this.service = service; }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
    try {
      return ResponseEntity.ok(service.login(req));
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }
}
EOF

# SecurityConfig.java
cat > "$SERVICE_ROOT/src/main/java/$PKG_PATH/config/SecurityConfig.java" <<'EOF'
package com.saasplatform.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
  @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
  @Bean public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors().and().csrf().disable()
      .authorizeHttpRequests(authz -> authz
          .requestMatchers("/api/auth/**").permitAll()
          .anyRequest().authenticated()
      );
    return http.build();
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

echo "✅ auth-service scaffold complete in $SERVICE_ROOT"
