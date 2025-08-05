package com.ekyc.authservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users", schema = "auth")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
  private UUID id;

  @Email
  @NotBlank
  @Column(unique = true)
  private String email;

  @Column(name = "password_hash")
  private String passwordHash;

  @Column(name = "firstname")
  private String firstname;

  @Column(name = "lastname")
  private String lastname;

  @Column(name = "date_of_birth")
  private String dateOfBirth;

  private String country;

  @NotBlank
  private String role;

  @Column(name = "tenant_id")
  private UUID tenantId;

  @Builder.Default
  private String status = "active";

  @Column(name = "last_login")
  private OffsetDateTime lastLogin;

  @Column(name = "created_at")
  @Builder.Default
  private OffsetDateTime createdAt = OffsetDateTime.now();

  @Column(name = "updated_at")
  @Builder.Default
  private OffsetDateTime updatedAt = OffsetDateTime.now();

  @PreUpdate
  public void preUpdate() { this.updatedAt = OffsetDateTime.now(); }
}
