package com.saasplatform.moduleservice.repository;

import com.saasplatform.moduleservice.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ModuleRepository extends JpaRepository<Module, UUID> {
  List<Module> findByStatus(String status);
  List<Module> findByCategoryAndStatus(String category, String status);
  Optional<Module> findByName(String name);
}
