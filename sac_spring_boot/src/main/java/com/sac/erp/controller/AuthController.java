package com.sac.erp.controller;

import com.sac.erp.dto.AuthResponse;
import com.sac.erp.dto.LoginRequest;
import com.sac.erp.entity.User;
import com.sac.erp.modules.superadmin.entity.SuperAdmin;
import com.sac.erp.modules.superadmin.repository.SuperAdminRepository;
import com.sac.erp.repository.UserRepository;
import com.sac.erp.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final SuperAdminRepository superAdminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        log.info("Attempting login for user: {}", request.getUsername());

        // Try by username first, then by email
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("error", "Invalid credentials"));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("error", "Invalid credentials"));
        }

        String role = (user.getRole() != null) ? user.getRole().getName() : "User";
        String tenantId = (user.getSchoolId() != null) ? String.valueOf(user.getSchoolId()) : "1";
        String token = jwtUtils.generateToken(user.getUsername(), role, tenantId);

        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), role, tenantId));
    }

    @PostMapping("/superadmin/login")
    public ResponseEntity<?> superAdminLogin(@Valid @RequestBody LoginRequest request) {
        log.info("Attempting SuperAdmin login for: {}", request.getUsername());

        SuperAdmin superAdmin = superAdminRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (superAdmin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("error", "Invalid credentials"));
        }

        if (!passwordEncoder.matches(request.getPassword(), superAdmin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("error", "Invalid credentials"));
        }

        String token = jwtUtils.generateToken(superAdmin.getUsername(), "SUPERADMIN", null);
        return ResponseEntity.ok(new AuthResponse(token, superAdmin.getUsername(), "SUPERADMIN", null));
    }
}
