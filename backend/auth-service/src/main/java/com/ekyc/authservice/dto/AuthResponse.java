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
}
