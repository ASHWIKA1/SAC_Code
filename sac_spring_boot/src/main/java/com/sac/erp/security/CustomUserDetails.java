package com.sac.erp.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final String username;
    private final String password;
    private final String tenantId;
    private final boolean isSuperAdmin;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(String username, String password, String tenantId, String role, boolean isSuperAdmin, java.util.List<String> permissions) {
        this.username = username;
        this.password = password;
        this.tenantId = tenantId;
        this.isSuperAdmin = isSuperAdmin;
        
        java.util.List<GrantedAuthority> auths = new java.util.ArrayList<>();
        auths.add(new SimpleGrantedAuthority("ROLE_" + role));
        if (permissions != null) {
            for (String perm : permissions) {
                auths.add(new SimpleGrantedAuthority(perm));
            }
        }
        this.authorities = auths;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public String getTenantId() {
        return tenantId;
    }

    public boolean isSuperAdmin() {
        return isSuperAdmin;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
