package com.ekyc.moduleservice.service;

import com.ekyc.moduleservice.dto.CreateModuleRequest;
import com.ekyc.moduleservice.dto.ModuleDto;
import com.ekyc.moduleservice.entity.Module;
import com.ekyc.moduleservice.repository.ModuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ModuleService {

  private final ModuleRepository repo;

  public ModuleService(ModuleRepository repo) {
    this.repo = repo;
  }

  public List<ModuleDto> getActiveModules() {
    return repo.findByStatus("active").stream().map(this::toDto).collect(Collectors.toList());
  }

  public List<ModuleDto> getModulesByCategory(String category) {
    return repo.findByCategoryAndStatus(category, "active").stream().map(this::toDto).collect(Collectors.toList());
  }

  public ModuleDto create(CreateModuleRequest req) {
    Module m = new Module();
    m.setName(req.getName());
    m.setDescription(req.getDescription());
    m.setCategory(req.getCategory());
    m.setFeatures(req.getFeatures());
    m.setMonthlyPrice(req.getMonthlyPrice());
    m.setYearlyPrice(req.getYearlyPrice());
    m.setStatus("active");
    return toDto(repo.save(m));
  }

  public void delete(UUID id) { repo.deleteById(id); }

  private ModuleDto toDto(Module m) {
    return new ModuleDto(
      m.getId(), m.getName(), m.getDescription(), m.getCategory(),
      m.getFeatures(), m.getMonthlyPrice(), m.getYearlyPrice(), m.getStatus()
    );
  }
}
