package com.ekyc.userservice.service.impl;

import com.ekyc.common.dto.UserSyncRequest;
import com.ekyc.userservice.entity.User;
import com.ekyc.userservice.repository.UserRepository;
import com.ekyc.userservice.service.DatabaseUserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class DatabaseUserServiceImpl implements DatabaseUserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseUserServiceImpl(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserSyncRequest createUser(UserSyncRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstname(request.getFirstName());
        user.setLastname(request.getLastName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setCountry(request.getCountry());
        user.setPhone(request.getPhone());
        user.setPasswordHash(request.getPasswordHash());
        user.setRole(request.getRole());
        user.setTenantId(request.getTenantId());
        user.setStatus(request.getStatus());
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());
        
        user = repository.save(user);
        
        return convertToUserSyncRequest(user);
    }

    @Override
    public UserSyncRequest createSocialUser(UserSyncRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstname(request.getFirstName());
        user.setLastname(request.getLastName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setCountry(request.getCountry());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setTenantId(request.getTenantId());
        user.setStatus(request.getStatus());
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());
        
        user = repository.save(user);
        
        return convertToUserSyncRequest(user);
    }

    @Override
    public UserSyncRequest findByEmail(String email) {
        return repository.findByEmail(email)
                .map(this::convertToUserSyncRequest)
                .orElse(null);
    }

    @Override
    public UserSyncRequest findById(UUID userId) {
        return repository.findById(userId)
                .map(this::convertToUserSyncRequest)
                .orElse(null);
    }

    @Override
    public UserSyncRequest updateUser(UserSyncRequest request) {
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstname(request.getFirstName());
        user.setLastname(request.getLastName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setCountry(request.getCountry());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setStatus(request.getStatus());
        user.setUpdatedAt(OffsetDateTime.now());
        
        user = repository.save(user);
        
        return convertToUserSyncRequest(user);
    }

    @Override
    public void updateKeycloakId(UUID userId, String keycloakId) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setKeycloakId(keycloakId);
        user.setUpdatedAt(OffsetDateTime.now());
        
        repository.save(user);
    }

    @Override
    public boolean validatePassword(UserSyncRequest user, String password) {
        User dbUser = repository.findByEmail(user.getEmail())
                .orElse(null);
        
        if (dbUser == null || dbUser.getPasswordHash() == null) {
            return false;
        }
        
        return passwordEncoder.matches(password, dbUser.getPasswordHash());
    }

    @Override
    public void deleteUser(UUID userId) {
        repository.deleteById(userId);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.findByEmail(email).isPresent();
    }

    @Override
    public boolean existsById(UUID userId) {
        return repository.existsById(userId);
    }

    private UserSyncRequest convertToUserSyncRequest(User user) {
        UserSyncRequest request = new UserSyncRequest();
        request.setUserId(user.getId());
        request.setEmail(user.getEmail());
        request.setFirstName(user.getFirstname());
        request.setLastName(user.getLastname());
        request.setDateOfBirth(user.getDateOfBirth());
        request.setCountry(user.getCountry());
        request.setPhone(user.getPhone());
        request.setPasswordHash(user.getPasswordHash());
        request.setRole(user.getRole());
        request.setTenantId(user.getTenantId());
        request.setStatus(user.getStatus());
        request.setCreatedAt(user.getCreatedAt());
        request.setUpdatedAt(user.getUpdatedAt());
        return request;
    }
} 