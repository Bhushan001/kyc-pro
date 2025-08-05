package com.ekyc.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
  @Email
  @NotBlank
  private String email;

  @NotBlank
  private String password;

  @NotBlank
  private String firstname;

  @NotBlank
  private String lastname;

  @NotNull
  @Past
  private LocalDate dateOfBirth;

  @NotBlank
  private String country;

  @NotBlank
  private String role;

  @NotBlank
  private String termsAccepted;
} 