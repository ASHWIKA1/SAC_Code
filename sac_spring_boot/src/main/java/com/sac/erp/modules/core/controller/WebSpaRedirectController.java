package com.sac.erp.modules.core.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class WebSpaRedirectController {

    @RequestMapping(value = {
        "/testing_of_sac",
        "/testing_of_sac/",
        "/testing_of_sac/{path:[^\\.]*}",
        "/testing_of_sac/{path1:[^\\.]*}/{path2:[^\\.]*}",
        "/testing_of_sac/{path1:[^\\.]*}/{path2:[^\\.]*}/{path3:[^\\.]*}",
        "/testing_of_sac/{path1:[^\\.]*}/{path2:[^\\.]*}/{path3:[^\\.]*}/{path4:[^\\.]*}"
    })
    public String redirectSpaTestingOfSac(HttpServletRequest request) {
        String servletPath = request.getServletPath();
        
        // If it's a WebSocket connection under the subpath, forward it to root ws endpoint
        if (servletPath.startsWith("/testing_of_sac/ws-")) {
            return "forward:" + servletPath.substring("/testing_of_sac".length());
        }
        
        // If it's an API, Swagger, Actuator request under the subpath, return 404 immediately
        if (servletPath.startsWith("/testing_of_sac/api") || 
            servletPath.startsWith("/testing_of_sac/swagger") || 
            servletPath.startsWith("/testing_of_sac/v3/api-docs") || 
            servletPath.startsWith("/testing_of_sac/actuator") ||
            servletPath.startsWith("/testing_of_sac/error")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "API endpoint not found");
        }
        
        return "forward:/testing_of_sac/index.html";
    }

    @RequestMapping(value = {
        "/{path:[^\\.]*}",
        "/{path1:[^\\.]*}/{path2:[^\\.]*}",
        "/{path1:[^\\.]*}/{path2:[^\\.]*}/{path3:[^\\.]*}",
        "/{path1:[^\\.]*}/{path2:[^\\.]*}/{path3:[^\\.]*}/{path4:[^\\.]*}"
    })
    public String redirectSpa(HttpServletRequest request) {
        String servletPath = request.getServletPath();
        if (servletPath.startsWith("/ws-")) {
            return "forward:" + servletPath;
        }
        if (servletPath.startsWith("/api") || 
            servletPath.startsWith("/swagger") || 
            servletPath.startsWith("/v3/api-docs") || 
            servletPath.startsWith("/actuator") ||
            servletPath.startsWith("/error")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "API endpoint not found");
        }
        return "forward:/index.html";
    }
}
