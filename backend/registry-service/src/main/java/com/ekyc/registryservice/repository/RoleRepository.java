package com.ekyc.registryservice.repository;

import com.ekyc.registryservice.entity.Role;
import com.ekyc.registryservice.enums.RoleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    
    Optional<Role> findByRoleName(String roleName);
    
    Optional<Role> findByRoleCode(String roleCode);
    
    Optional<Role> findByKeycloakRoleId(String keycloakRoleId);
    
    List<Role> findByStatus(RoleStatus status);
    
    List<Role> findByTenantId(UUID tenantId);
    
    List<Role> findByTenantIdAndStatus(UUID tenantId, RoleStatus status);
    
    @Query("SELECT r FROM Role r WHERE r.roleName = :roleName AND r.status != 'DELETED'")
    Optional<Role> findByRoleNameAndNotDeleted(@Param("roleName") String roleName);
    
    @Query("SELECT r FROM Role r WHERE r.roleCode = :roleCode AND r.status != 'DELETED'")
    Optional<Role> findByRoleCodeAndNotDeleted(@Param("roleCode") String roleCode);
    
    @Query("SELECT r FROM Role r WHERE r.status != 'DELETED'")
    List<Role> findAllActive();
    
    boolean existsByRoleNameAndStatusNot(String roleName, RoleStatus status);
    
    boolean existsByRoleCodeAndStatusNot(String roleCode, RoleStatus status);
} 