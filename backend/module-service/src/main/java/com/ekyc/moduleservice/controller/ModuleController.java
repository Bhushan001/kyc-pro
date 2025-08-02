package com.ekyc.moduleservice.controller;

import com.ekyc.moduleservice.dto.CreateModuleRequest;
import com.ekyc.moduleservice.dto.ModuleDto;
import com.ekyc.moduleservice.service.ModuleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "*")
public class ModuleController {

  private final ModuleService service;

  public ModuleController(ModuleService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<ModuleDto>> getActiveModules() {
    return ResponseEntity.ok(service.getActiveModules());
  }

  @GetMapping("/category/{category}")
  public ResponseEntity<List<ModuleDto>> getModulesByCategory(@PathVariable String category) {
    return ResponseEntity.ok(service.getModulesByCategory(category));
  }

  @PostMapping
  public ResponseEntity<ModuleDto> createModule(@Valid @RequestBody CreateModuleRequest request) {
    return ResponseEntity.ok(service.create(request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteModule(@PathVariable UUID id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
