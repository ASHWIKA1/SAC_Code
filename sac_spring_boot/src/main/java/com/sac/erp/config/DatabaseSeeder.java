package com.sac.erp.config;

import com.sac.erp.modules.core.entity.Role;
import com.sac.erp.modules.core.entity.User;
import com.sac.erp.modules.core.repository.RoleRepository;
import com.sac.erp.modules.core.repository.UserRepository;
import com.sac.erp.modules.superadmin.entity.SuperAdmin;
import com.sac.erp.modules.superadmin.repository.SuperAdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SuperAdminRepository superAdminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            log.info("Seeding default roles...");
            Role adminRole = new Role();
            adminRole.setId(1L);
            adminRole.setName("Admin");
            adminRole.setType("System");
            adminRole.setActiveStatus(1);
            adminRole.setSchoolId(1L);
            roleRepository.save(adminRole);
        }

        if (superAdminRepository.count() == 0) {
            log.info("Seeding default superadmin...");
            SuperAdmin superAdmin = new SuperAdmin();
            superAdmin.setId(1L);
            superAdmin.setUsername("superadmin");
            superAdmin.setEmail("superadmin@sacgotek.com");
            superAdmin.setPassword(passwordEncoder.encode("password"));
            superAdmin.setFullName("System SuperAdmin");
            superAdmin.setPhoneNumber("9999999999");
            superAdmin.setActiveStatus(true);
            superAdmin.setRole("super_admin");
            superAdminRepository.save(superAdmin);
        }

        if (userRepository.count() == 0) {
            log.info("Seeding default admin user...");
            Role adminRole = roleRepository.findById(1L).orElse(null);
            User user = new User();
            user.setId(1L);
            user.setName("Demo School Admin");
            user.setEmail("admin@sacgotek.com");
            user.setUsername("admin");
            user.setPassword(passwordEncoder.encode("password"));
            user.setPhone("1234567890");
            user.setIsAdministrator(true);
            user.setActiveStatus(1);
            user.setRole(adminRole);
            user.setSchoolId(1L);
            userRepository.save(user);
        }
        log.info("Database seeding completed.");
    }
}
