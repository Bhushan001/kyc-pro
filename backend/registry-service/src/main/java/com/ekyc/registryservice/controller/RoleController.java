package com.ekyc.registryservice.controller;

import com.ekyc.registryservice.dto.CreateRoleRequest;
import com.ekyc.registryservice.dto.RoleResponse;
import com.ekyc.registryservice.exception.RoleAlreadyExistsException;
import com.ekyc.registryservice.exception.RoleNotFoundException;
import com.ekyc.registryservice.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/registry/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping("/create")
    public ResponseEntity<RoleResponse> createRole(@Valid @RequestBody CreateRoleRequest request) {
        try {
            RoleResponse response = roleService.createRole(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RoleAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{roleId}")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable UUID roleId) {
        try {
            RoleResponse response = roleService.getRoleById(roleId);
            return ResponseEntity.ok(response);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/code/{roleCode}")
    public ResponseEntity<RoleResponse> getRoleByCode(@PathVariable String roleCode) {
        try {
            RoleResponse response = roleService.getRoleByCode(roleCode);
            return ResponseEntity.ok(response);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        try {
            List<RoleResponse> roles = roleService.getAllRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<RoleResponse>> getRolesByTenant(@PathVariable UUID tenantId) {
        try {
            List<RoleResponse> roles = roleService.getRolesByTenant(tenantId);
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{roleId}")
    public ResponseEntity<RoleResponse> updateRole(@PathVariable UUID roleId, 
                                                 @Valid @RequestBody CreateRoleRequest request) {
        try {
            RoleResponse response = roleService.updateRole(roleId, request);
            return ResponseEntity.ok(response);
        } catch (RoleNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (RoleAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{roleId}")
    public ResponseEntity<Void> deleteRole(@PathVariable UUID roleId) {
        try {
            roleService.deleteRole(roleId);
            return ResponseEntity.noContent().build();
        } catch (RoleNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Registry Service is running");
    }
} 