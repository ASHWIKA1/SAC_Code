package com.sac.erp.modules.permission.service;

import com.sac.erp.modules.permission.dto.MenuDto;

import java.util.List;

public interface MenuPermissionService {
    List<String> getPermissionsForUser(String username);
    List<MenuDto> getSidebarMenusForUser(String username);
}
