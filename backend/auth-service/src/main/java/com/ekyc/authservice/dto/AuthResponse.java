package com.ekyc.authservice.dto;

import java.util.UUID;

public class AuthResponse {
  private String token;
  private UUID userId;
  private String email;
  private String firstname;
  private String lastname;
  private String role;
  private UUID tenantId;
  private String keycloakId;
  private String status;
  private String dateOfBirth;
  private String country;
  private String phone;

  public AuthResponse(String token, UUID userId, String email, String firstname, String lastname, String role, UUID tenantId) {
    this.token = token;
    this.userId = userId;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.role = role;
    this.tenantId = tenantId;
  }

  public String getToken() { return token; }
  public UUID getUserId() { return userId; }
  public String getEmail() { return email; }
  public String getFirstname() { return firstname; }
  public String getLastname() { return lastname; }
  public String getRole() { return role; }
  public UUID getTenantId() { return tenantId; }
  public String getKeycloakId() { return keycloakId; }
  public void setKeycloakId(String keycloakId) { this.keycloakId = keycloakId; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public String getDateOfBirth() { return dateOfBirth; }
  public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
  public String getCountry() { return country; }
  public void setCountry(String country) { this.country = country; }
  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }
}
