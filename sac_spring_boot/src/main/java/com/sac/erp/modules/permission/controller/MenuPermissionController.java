package com.sac.erp.modules.permission.controller;

import com.sac.erp.modules.permission.dto.MenuDto;
import com.sac.erp.modules.permission.service.MenuPermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class MenuPermissionController {

    private final MenuPermissionService menuPermissionService;

    @GetMapping("/menus/sidebar")
    public ResponseEntity<List<MenuDto>> getSidebar(Principal principal) {
        String username = principal.getName();
        log.info("REST request to get sidebar for user: {}", username);
        List<MenuDto> sidebar = menuPermissionService.getSidebarMenusForUser(username);
        return ResponseEntity.ok(sidebar);
    }

    @GetMapping("/permissions/my")
    public ResponseEntity<List<String>> getMyPermissions(Principal principal) {
        String username = principal.getName();
        log.info("REST request to get active permission routes for user: {}", username);
        List<String> permissions = menuPermissionService.getPermissionsForUser(username);
        return ResponseEntity.ok(permissions);
    }
}
