package com.ekyc.moduleservice.controller;

import com.ekyc.moduleservice.dto.CreateModuleRequest;
import com.ekyc.moduleservice.dto.ModuleDto;
import com.ekyc.moduleservice.service.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/modules")
@Slf4j
@RequiredArgsConstructor
public class ModuleController {
  private final ModuleService service;

  @PostMapping
  public ResponseEntity<ModuleDto> createModule(@Valid @RequestBody CreateModuleRequest req) {
    return ResponseEntity.ok(service.create(req));
  }

  @GetMapping
  public ResponseEntity<List<ModuleDto>> getAllModules() {
    return ResponseEntity.ok(service.getActiveModules());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ModuleDto> getModuleById(@PathVariable UUID id) {
    return ResponseEntity.ok(service.getModuleById(id));
  }
}
