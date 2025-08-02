package com.ekyc.userservice.service;

import com.ekyc.userservice.dto.CreateUserRequest;
import com.ekyc.userservice.dto.UserDto;
import com.ekyc.userservice.entity.User;
import com.ekyc.userservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDto> getUsersByTenant(UUID tenantId) {
        return repository.findAllByTenantId(tenantId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(UUID id) {
        return repository.findById(id).map(this::toDto).orElse(null);
    }

    public UserDto createUser(CreateUserRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(request.getRole());
        user.setTenantId(request.getTenantId());
        user.setStatus("active");
        user = repository.save(user);
        return toDto(user);
    }

    public void deleteUserById(UUID id) {
        repository.deleteById(id);
    }

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getTenantId(),
                user.getStatus()
        );
    }
}
