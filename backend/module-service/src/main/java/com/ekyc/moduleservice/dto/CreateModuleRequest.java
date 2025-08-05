package com.ekyc.moduleservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
