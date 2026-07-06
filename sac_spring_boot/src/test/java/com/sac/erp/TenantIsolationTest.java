package com.sac.erp;

import com.sac.erp.security.JwtUtils;
import com.sac.erp.tenant.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = TestApplication.class)
@ActiveProfiles("test")
public class TenantIsolationTest {

    @Autowired
    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        TenantContext.clear();
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testTenantContextIsolation() {
        TenantContext.setCurrentTenant("school_A");
        assertEquals("school_A", TenantContext.getCurrentTenant());

        // Launch in background thread to verify ThreadLocal isolation
        Thread thread = new Thread(() -> {
            assertNull(TenantContext.getCurrentTenant());
            TenantContext.setCurrentTenant("school_B");
            assertEquals("school_B", TenantContext.getCurrentTenant());
        });
        thread.start();
        try {
            thread.join();
        } catch (InterruptedException e) {
            fail("Thread join interrupted");
        }

        // Verify original thread is untouched
        assertEquals("school_A", TenantContext.getCurrentTenant());
    }

    @Test
    void testJwtUtilsGenerationAndParsing() {
        String token = jwtUtils.generateToken("testuser", "STUDENT", "school_1");
        assertNotNull(token);
        assertTrue(jwtUtils.validateToken(token));

        assertEquals("testuser", jwtUtils.getUsernameFromToken(token));
        assertEquals("STUDENT", jwtUtils.getRoleFromToken(token));
        assertEquals("school_1", jwtUtils.getTenantFromToken(token));
    }
}
