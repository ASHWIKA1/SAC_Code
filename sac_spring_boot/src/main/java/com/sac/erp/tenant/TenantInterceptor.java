package com.sac.erp.tenant;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@Component
public class TenantInterceptor implements HandlerInterceptor {

    private static final String TENANT_HEADER = "X-Tenant-ID";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String tenantId = request.getHeader(TENANT_HEADER);

        // Fallback: Resolve via Subdomain
        if (tenantId == null || tenantId.isEmpty()) {
            String serverName = request.getServerName();
            tenantId = resolveTenantFromSubdomain(serverName);
        }

        if (tenantId != null && !tenantId.isEmpty()) {
            TenantContext.setCurrentTenant(tenantId);
        } else {
            log.warn("No tenant identifier resolved for request: {}", request.getRequestURI());
        }
        
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // No-op
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        TenantContext.clear();
    }

    private String resolveTenantFromSubdomain(String serverName) {
        if (serverName == null || serverName.equals("localhost") || serverName.equals("127.0.0.1")) {
            return null;
        }
        
        String[] parts = serverName.split("\\.");
        if (parts.length > 2) {
            // For school1.erp.com, return school1
            String subdomain = parts[0];
            if (!subdomain.equalsIgnoreCase("www") && !subdomain.equalsIgnoreCase("api")) {
                return subdomain;
            }
        }
        return null;
    }
}
