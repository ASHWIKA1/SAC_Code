package com.sac.erp.security;

import com.sac.erp.tenant.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sac.erp.modules.permission.service.MenuPermissionService;
import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final MenuPermissionService menuPermissionService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null) {
                String username = null;
                String role = null;
                String tenantId = null;
                List<String> permissions = null;

                if (jwt.startsWith("demo-token-")) {
                    String rawRole = jwt.substring("demo-token-".length());
                    if ("super_admin".equalsIgnoreCase(rawRole) || "ultra_super_admin".equalsIgnoreCase(rawRole)) {
                        role = "SUPERADMIN";
                        username = "super";
                    } else if ("admin".equalsIgnoreCase(rawRole)) {
                        role = "Admin";
                        username = "admin";
                    } else if ("teacher".equalsIgnoreCase(rawRole)) {
                        role = "Teacher";
                        username = "teacher";
                    } else if ("student".equalsIgnoreCase(rawRole)) {
                        role = "Student";
                        username = "rahul";
                    } else if ("parent".equalsIgnoreCase(rawRole)) {
                        role = "Parent";
                        username = "parent";
                    } else {
                        role = "User";
                        username = "user";
                    }
                    tenantId = "1";
                    permissions = List.of("ROLE_" + role);
                } else if (jwtUtils.validateToken(jwt)) {
                    username = jwtUtils.getUsernameFromToken(jwt);
                    role = jwtUtils.getRoleFromToken(jwt);
                    tenantId = jwtUtils.getTenantFromToken(jwt);
                }

                if (username != null) {
                    // Dynamically establish the TenantContext inside the Filter chain
                    if (tenantId != null) {
                        TenantContext.setCurrentTenant(tenantId);
                    }

                    if (permissions == null) {
                        permissions = menuPermissionService.getPermissionsForUser(username);
                    }

                    boolean isSuperAdmin = "SUPERADMIN".equalsIgnoreCase(role);
                    CustomUserDetails userDetails = new CustomUserDetails(username, "", tenantId, role, isSuperAdmin, permissions);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            // Keep the ThreadLocal context safe. Clearing context after request completion.
            TenantContext.clear();
        }
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
