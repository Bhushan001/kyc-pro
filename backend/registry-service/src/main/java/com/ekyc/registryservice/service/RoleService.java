package com.ekyc.registryservice.service;

import com.ekyc.common.dto.SyncResponse;
import com.ekyc.registryservice.dto.CreateRoleRequest;
import com.ekyc.registryservice.dto.RoleResponse;
import com.ekyc.registryservice.entity.Role;
import com.ekyc.registryservice.enums.RoleStatus;
import com.ekyc.registryservice.exception.RoleAlreadyExistsException;
import com.ekyc.registryservice.exception.RoleNotFoundException;
import com.ekyc.registryservice.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private KeycloakSyncClient keycloakSyncClient;

    @Transactional
    public RoleResponse createRole(CreateRoleRequest request) {
        // Validate role name and code uniqueness
        validateRoleUniqueness(request.getRoleName(), request.getRoleCode());
        
        // Create role entity
        Role role = new Role();
        role.setRoleName(request.getRoleName());
        role.setRoleCode(request.getRoleCode());
        role.setDescription(request.getDescription());
        role.setCategory(request.getCategory());
        role.setTenantId(request.getTenantId());
        role.setStatus(RoleStatus.DRAFT);
        
        try {
            // First save to database
            role = roleRepository.save(role);
            
            // Then sync to Keycloak
            SyncResponse keycloakResponse = keycloakSyncClient.syncRole(
                request.getRoleCode(), 
                request.getDescription()
            );
            
            // Debug logging
            System.out.println("=== Keycloak Sync Debug ===");
            System.out.println("Keycloak Response Success: " + keycloakResponse.isSuccess());
            System.out.println("Keycloak Response Message: " + keycloakResponse.getMessage());
            System.out.println("Keycloak Role ID: " + keycloakResponse.getKeycloakRoleId());
            System.out.println("==========================");
            
            if (keycloakResponse.isSuccess()) {
                // Update role with Keycloak ID and activate
                role.setKeycloakRoleId(keycloakResponse.getKeycloakRoleId()); // Use keycloakRoleId field
                role.setStatus(RoleStatus.ACTIVE);
                role = roleRepository.save(role);
                
                return toRoleResponse(role);
            } else {
                // Keycloak sync failed, but still mark as active since role exists in database
                role.setStatus(RoleStatus.ACTIVE);
                role = roleRepository.save(role);
                
                return toRoleResponse(role);
            }
            
        } catch (Exception e) {
            // If database save fails, don't proceed with Keycloak sync
            throw new RuntimeException("Failed to create role: " + e.getMessage());
        }
    }

    public RoleResponse getRoleById(UUID roleId) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new RoleNotFoundException("Role not found with ID: " + roleId));
        return toRoleResponse(role);
    }

    public RoleResponse getRoleByCode(String roleCode) {
        Role role = roleRepository.findByRoleCodeAndNotDeleted(roleCode)
            .orElseThrow(() -> new RoleNotFoundException("Role not found with code: " + roleCode));
        return toRoleResponse(role);
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAllActive()
            .stream()
            .map(this::toRoleResponse)
            .collect(Collectors.toList());
    }

    public List<RoleResponse> getRolesByTenant(UUID tenantId) {
        return roleRepository.findByTenantIdAndStatus(tenantId, RoleStatus.ACTIVE)
            .stream()
            .map(this::toRoleResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public RoleResponse updateRole(UUID roleId, CreateRoleRequest request) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new RoleNotFoundException("Role not found with ID: " + roleId));
        
        // Check if new name/code conflicts with other roles
        if (!role.getRoleName().equals(request.getRoleName())) {
            validateRoleNameUniqueness(request.getRoleName(), roleId);
        }
        if (!role.getRoleCode().equals(request.getRoleCode())) {
            validateRoleCodeUniqueness(request.getRoleCode(), roleId);
        }
        
        // Update role
        role.setRoleName(request.getRoleName());
        role.setRoleCode(request.getRoleCode());
        role.setDescription(request.getDescription());
        role.setCategory(request.getCategory());
        role.setTenantId(request.getTenantId());
        
        try {
            // Update in Keycloak
            SyncResponse keycloakResponse = keycloakSyncClient.syncRole(
                request.getRoleCode(), 
                request.getDescription()
            );
            
            if (keycloakResponse.isSuccess()) {
                role.setStatus(RoleStatus.ACTIVE);
            } else {
                role.setStatus(RoleStatus.DRAFT);
            }
            
            role = roleRepository.save(role);
            return toRoleResponse(role);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to update role: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteRole(UUID roleId) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new RoleNotFoundException("Role not found with ID: " + roleId));
        
        try {
            // Delete from Keycloak
            keycloakSyncClient.deleteRole(role.getRoleCode());
            
            // Soft delete from database
            role.setStatus(RoleStatus.DELETED);
            roleRepository.save(role);
            
        } catch (Exception e) {
            // If Keycloak deletion fails, still mark as deleted in database
            role.setStatus(RoleStatus.DELETED);
            roleRepository.save(role);
            throw new RuntimeException("Failed to delete role from Keycloak: " + e.getMessage());
        }
    }

    private void validateRoleUniqueness(String roleName, String roleCode) {
        validateRoleNameUniqueness(roleName, null);
        validateRoleCodeUniqueness(roleCode, null);
    }

    private void validateRoleNameUniqueness(String roleName, UUID excludeRoleId) {
        if (excludeRoleId == null) {
            if (roleRepository.existsByRoleNameAndStatusNot(roleName, RoleStatus.DELETED)) {
                throw new RoleAlreadyExistsException("Role with name '" + roleName + "' already exists");
            }
        } else {
            // For updates, exclude current role from uniqueness check
            roleRepository.findByRoleNameAndNotDeleted(roleName)
                .filter(role -> !role.getId().equals(excludeRoleId))
                .ifPresent(role -> {
                    throw new RoleAlreadyExistsException("Role with name '" + roleName + "' already exists");
                });
        }
    }

    private void validateRoleCodeUniqueness(String roleCode, UUID excludeRoleId) {
        if (excludeRoleId == null) {
            if (roleRepository.existsByRoleCodeAndStatusNot(roleCode, RoleStatus.DELETED)) {
                throw new RoleAlreadyExistsException("Role with code '" + roleCode + "' already exists");
            }
        } else {
            // For updates, exclude current role from uniqueness check
            roleRepository.findByRoleCodeAndNotDeleted(roleCode)
                .filter(role -> !role.getId().equals(excludeRoleId))
                .ifPresent(role -> {
                    throw new RoleAlreadyExistsException("Role with code '" + roleCode + "' already exists");
                });
        }
    }

    private RoleResponse toRoleResponse(Role role) {
        return new RoleResponse(
            role.getId(),
            role.getRoleName(),
            role.getRoleCode(),
            role.getDescription(),
            role.getCategory(),
            role.getStatus(),
            role.getKeycloakRoleId(),
            role.getTenantId(),
            role.getCreatedAt(),
            role.getUpdatedAt()
        );
    }
} 