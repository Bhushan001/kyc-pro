package com.ekyc.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

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

  // Getters and Setters
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }

  public String getFirstname() { return firstname; }
  public void setFirstname(String firstname) { this.firstname = firstname; }

  public String getLastname() { return lastname; }
  public void setLastname(String lastname) { this.lastname = lastname; }

  public LocalDate getDateOfBirth() { return dateOfBirth; }
  public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

  public String getCountry() { return country; }
  public void setCountry(String country) { this.country = country; }

  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }

  public String getTermsAccepted() { return termsAccepted; }
  public void setTermsAccepted(String termsAccepted) { this.termsAccepted = termsAccepted; }
} 