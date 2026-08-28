package com.sac.erp.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class IdempotencyFilter implements Filter {

    private final ConcurrentHashMap<String, Long> keyStore = new ConcurrentHashMap<>();
    private static final long WINDOW_MS = 10000; // 10 seconds sliding window

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (request instanceof HttpServletRequest httpRequest && response instanceof HttpServletResponse httpResponse) {
            String path = httpRequest.getRequestURI();
            
            // Apply idempotency check for POS checkout, recharge, and refund requests
            if (path.contains("/canteen/pos/checkout") || 
                path.contains("/canteen/wallets/") && path.contains("/recharge") || 
                path.contains("/canteen/transactions/") && path.contains("/refund")) {
                
                String key = httpRequest.getHeader("X-Idempotency-Key");
                
                if (key == null || key.trim().isEmpty()) {
                    if (path.contains("/canteen/pos/checkout")) {
                        httpResponse.setStatus(HttpStatus.BAD_REQUEST.value());
                        httpResponse.getWriter().write("Missing required X-Idempotency-Key header");
                        return;
                    }
                    // For other endpoints, allow if no key is provided, or we can just pass
                    chain.doFilter(request, response);
                    return;
                }
                
                long now = System.currentTimeMillis();
                Long existingTime = keyStore.putIfAbsent(key, now);
                
                if (existingTime != null) {
                    if (now - existingTime < WINDOW_MS) {
                        httpResponse.setStatus(HttpStatus.CONFLICT.value());
                        httpResponse.getWriter().write("Duplicate request detected. Action is already in progress.");
                        return;
                    } else {
                        // Key expired, update timestamp
                        keyStore.put(key, now);
                    }
                }
                
                // Cleanup expired keys periodically to prevent memory growth
                keyStore.entrySet().removeIf(entry -> now - entry.getValue() > WINDOW_MS);
            }
        }
        
        chain.doFilter(request, response);
    }
}
