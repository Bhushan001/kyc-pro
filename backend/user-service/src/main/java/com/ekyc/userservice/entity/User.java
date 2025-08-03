package com.ekyc.userservice.entity;

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
    @Column(name = "firstname")
    private String firstname;

    @NotBlank
    @Column(name = "lastname")
    private String lastname;

    @NotBlank
    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @NotBlank
    private String country;

    private String phone;

    @NotBlank
    private String role;

    @Column(name = "tenant_id", nullable = true)
    private UUID tenantId;

    @Column(nullable = false)
    private String status = "active";

    @Column(name = "last_login")
    private OffsetDateTime lastLogin;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @Column(name = "keycloak_id")
    private String keycloakId;

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

    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }

    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

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

    public String getKeycloakId() { return keycloakId; }
    public void setKeycloakId(String keycloakId) { this.keycloakId = keycloakId; }
}
