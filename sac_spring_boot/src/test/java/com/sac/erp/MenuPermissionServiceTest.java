package com.sac.erp;

import com.sac.erp.entity.AssignPermission;
import com.sac.erp.entity.Menu;
import com.sac.erp.entity.Permission;
import com.sac.erp.entity.Role;
import com.sac.erp.entity.User;
import com.sac.erp.modules.permission.dto.MenuDto;
import com.sac.erp.modules.permission.service.MenuPermissionServiceImpl;
import com.sac.erp.modules.superadmin.entity.SuperAdmin;
import com.sac.erp.modules.superadmin.repository.SuperAdminRepository;
import com.sac.erp.repository.AssignPermissionRepository;
import com.sac.erp.repository.MenuRepository;
import com.sac.erp.repository.PermissionRepository;
import com.sac.erp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class MenuPermissionServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private SuperAdminRepository superAdminRepository;
    @Mock
    private PermissionRepository permissionRepository;
    @Mock
    private AssignPermissionRepository assignPermissionRepository;
    @Mock
    private MenuRepository menuRepository;

    @InjectMocks
    private MenuPermissionServiceImpl menuPermissionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetPermissionsForUser_SuperAdmin() {
        SuperAdmin superAdmin = new SuperAdmin();
        superAdmin.setUsername("super_admin_user");

        List<Permission> allPerms = new ArrayList<>();
        Permission p1 = new Permission();
        p1.setRoute("class_list");
        Permission p2 = new Permission();
        p2.setRoute("student_admission");
        allPerms.add(p1);
        allPerms.add(p2);

        when(superAdminRepository.findByUsername("super_admin_user")).thenReturn(Optional.of(superAdmin));
        when(permissionRepository.findAll()).thenReturn(allPerms);

        List<String> routes = menuPermissionService.getPermissionsForUser("super_admin_user");

        assertEquals(2, routes.size());
        assertTrue(routes.contains("class_list"));
        assertTrue(routes.contains("student_admission"));
    }

    @Test
    void testGetPermissionsForUser_RegularUser() {
        User user = new User();
        user.setUsername("teacher1");
        Role role = new Role();
        role.setId(3L);
        role.setName("TEACHER");
        user.setRole(role);

        Permission perm = new Permission();
        perm.setId(10L);
        perm.setRoute("staff_attendance");

        AssignPermission assign = new AssignPermission();
        assign.setPermission(perm);
        assign.setStatus(1);

        List<AssignPermission> assigns = new ArrayList<>();
        assigns.add(assign);

        when(superAdminRepository.findByUsername("teacher1")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("teacher1")).thenReturn(Optional.of(user));
        when(assignPermissionRepository.findByRoleIdAndStatus(3L, 1)).thenReturn(assigns);

        List<String> routes = menuPermissionService.getPermissionsForUser("teacher1");

        assertEquals(1, routes.size());
        assertTrue(routes.contains("staff_attendance"));
    }

    @Test
    void testGetSidebarMenusForUser_HierarchicalTree() {
        User user = new User();
        user.setUsername("teacher1");
        Role role = new Role();
        role.setId(3L);
        user.setRole(role);

        Permission p1 = new Permission();
        p1.setId(101L);
        Permission p2 = new Permission();
        p2.setId(102L);

        AssignPermission assign1 = new AssignPermission();
        assign1.setPermission(p1);
        AssignPermission assign2 = new AssignPermission();
        assign2.setPermission(p2);

        List<AssignPermission> assigns = new ArrayList<>();
        assigns.add(assign1);
        assigns.add(assign2);

        // Sidebar Menus setup
        Menu m1 = new Menu(); // Parent
        m1.setId(1L);
        m1.setName("Academics");
        m1.setParentId(0L);
        m1.setPermissionId(101L);
        m1.setPosition(1);

        Menu m2 = new Menu(); // Child of m1
        m2.setId(2L);
        m2.setName("Class List");
        m2.setParentId(1L);
        m2.setPermissionId(102L);
        m2.setPosition(2);

        Menu m3 = new Menu(); // Parent denied/not assigned
        m3.setId(3L);
        m3.setName("Exam Module");
        m3.setParentId(0L);
        m3.setPermissionId(999L); // Denied
        m3.setPosition(3);

        List<Menu> menus = new ArrayList<>();
        menus.add(m1);
        menus.add(m2);
        menus.add(m3);

        when(superAdminRepository.findByUsername("teacher1")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("teacher1")).thenReturn(Optional.of(user));
        when(assignPermissionRepository.findByRoleIdAndStatus(3L, 1)).thenReturn(assigns);
        when(menuRepository.findByStatusAndMenuStatusOrderByPositionAsc(1, 1)).thenReturn(menus);

        List<MenuDto> tree = menuPermissionService.getSidebarMenusForUser("teacher1");

        // Should contain Academics (m1) as root with Class List (m2) as child. Exam Module (m3) should be missing.
        assertEquals(1, tree.size());
        MenuDto root = tree.get(0);
        assertEquals("Academics", root.getName());
        assertEquals(1, root.getChildren().size());
        assertEquals("Class List", root.getChildren().get(0).getName());
    }
}
