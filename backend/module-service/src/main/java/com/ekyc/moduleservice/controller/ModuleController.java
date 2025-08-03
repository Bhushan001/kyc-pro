package com.ekyc.moduleservice.controller;

import com.ekyc.moduleservice.dto.CreateModuleRequest;
import com.ekyc.moduleservice.dto.ModuleResponse;
import com.ekyc.moduleservice.service.ModuleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {
  private final ModuleService service;
  public ModuleController(ModuleService service) { this.service = service; }

  @PostMapping
  public ResponseEntity<ModuleResponse> createModule(@Valid @RequestBody CreateModuleRequest req) {
    return ResponseEntity.ok(service.createModule(req));
  }

  @GetMapping
  public ResponseEntity<List<ModuleResponse>> getAllModules() {
    return ResponseEntity.ok(service.getAllModules());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ModuleResponse> getModuleById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getModuleById(id));
  }
}
