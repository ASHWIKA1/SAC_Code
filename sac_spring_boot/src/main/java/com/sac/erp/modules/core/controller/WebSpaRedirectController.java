package com.sac.erp.modules.core.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebSpaRedirectController {

    @GetMapping(value = {
        "/{path:[^\\.]*}",
        "/{path1:[^\\.]*}/{path2:[^\\.]*}",
        "/{path1:[^\\.]*}/{path2:[^\\.]*}/{path3:[^\\.]*}"
    })
    public String redirectSpa(HttpServletRequest request) {
        String servletPath = request.getServletPath();
        // Skip API, Swagger documentation, and Actuator health check routes so they are handled normally
        if (servletPath.startsWith("/api") || servletPath.startsWith("/swagger") || servletPath.startsWith("/v3/api-docs") || servletPath.startsWith("/actuator")) {
            return "forward:" + servletPath;
        }
        return "forward:/index.html";
    }
}
