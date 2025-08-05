package com.ekyc.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

}
