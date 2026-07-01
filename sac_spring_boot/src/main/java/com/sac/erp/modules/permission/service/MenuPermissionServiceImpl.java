package com.sac.erp.modules.permission.service;

import com.sac.erp.modules.core.entity.AssignPermission;
import com.sac.erp.modules.core.entity.Menu;
import com.sac.erp.modules.core.entity.Permission;
import com.sac.erp.modules.core.entity.User;
import com.sac.erp.modules.permission.dto.MenuDto;
import com.sac.erp.modules.superadmin.entity.SuperAdmin;
import com.sac.erp.modules.superadmin.repository.SuperAdminRepository;
import com.sac.erp.modules.core.repository.AssignPermissionRepository;
import com.sac.erp.modules.core.repository.MenuRepository;
import com.sac.erp.modules.core.repository.PermissionRepository;
import com.sac.erp.modules.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuPermissionServiceImpl implements MenuPermissionService {

    private final UserRepository userRepository;
    private final SuperAdminRepository superAdminRepository;
    private final PermissionRepository permissionRepository;
    private final AssignPermissionRepository assignPermissionRepository;
    private final MenuRepository menuRepository;

    @Override
    @Transactional(readOnly = true)
    public List<String> getPermissionsForUser(String username) {
        // 1. Check if user is SuperAdmin
        Optional<SuperAdmin> superAdminOpt = superAdminRepository.findByUsername(username);
        if (superAdminOpt.isPresent()) {
            return permissionRepository.findAll().stream()
                    .map(Permission::getRoute)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }

        // 2. Otherwise load permissions for standard User's Role
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return Collections.emptyList();
        }

        User user = userOpt.get();
        if (user.getRole() == null) {
            return Collections.emptyList();
        }

        List<AssignPermission> assigns = assignPermissionRepository.findByRoleIdAndStatus(user.getRole().getId(), 1);
        return assigns.stream()
                .map(AssignPermission::getPermission)
                .filter(Objects::nonNull)
                .map(Permission::getRoute)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuDto> getSidebarMenusForUser(String username) {
        // 1. Determine allowed permission IDs
        Set<Long> allowedPermissionIds = new HashSet<>();
        boolean isSuperAdmin = false;

        Optional<SuperAdmin> superAdminOpt = superAdminRepository.findByUsername(username);
        if (superAdminOpt.isPresent()) {
            isSuperAdmin = true;
        } else {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (user.getRole() != null) {
                    List<AssignPermission> assigns = assignPermissionRepository.findByRoleIdAndStatus(user.getRole().getId(), 1);
                    for (AssignPermission assign : assigns) {
                        if (assign.getPermission() != null) {
                            allowedPermissionIds.add(assign.getPermission().getId());
                        }
                    }
                }
            }
        }

        // 2. Fetch all active menus
        List<Menu> allMenus = menuRepository.findByStatusAndMenuStatusOrderByPositionAsc(1, 1);

        // 3. Filter allowed menus
        final boolean superAdminFlag = isSuperAdmin;
        List<Menu> allowedMenus = allMenus.stream()
                .filter(m -> superAdminFlag || m.getPermissionId() == null || allowedPermissionIds.contains(m.getPermissionId()))
                .collect(Collectors.toList());

        // 4. Build Tree
        Map<Long, MenuDto> dtoMap = new LinkedHashMap<>();
        for (Menu menu : allowedMenus) {
            MenuDto dto = new MenuDto();
            dto.setId(menu.getId());
            dto.setName(menu.getName());
            dto.setRoute(menu.getRoute());
            dto.setIcon(menu.getIcon());
            dto.setPosition(menu.getPosition());
            dto.setParentId(menu.getParentId());
            dtoMap.put(menu.getId(), dto);
        }

        List<MenuDto> rootMenus = new ArrayList<>();
        for (MenuDto dto : dtoMap.values()) {
            if (dto.getParentId() == null || dto.getParentId() == 0 || !dtoMap.containsKey(dto.getParentId())) {
                rootMenus.add(dto);
            } else {
                MenuDto parentDto = dtoMap.get(dto.getParentId());
                parentDto.getChildren().add(dto);
            }
        }

        // Sort children by position
        for (MenuDto parentDto : dtoMap.values()) {
            parentDto.getChildren().sort(Comparator.comparing(MenuDto::getPosition, Comparator.nullsLast(Integer::compareTo)));
        }
        rootMenus.sort(Comparator.comparing(MenuDto::getPosition, Comparator.nullsLast(Integer::compareTo)));

        return rootMenus;
    }
}
