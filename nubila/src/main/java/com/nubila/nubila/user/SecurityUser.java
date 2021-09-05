package com.nubila.nubila.user;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class SecurityUser implements UserDetails{
    private Long id;
    private String user_login_id;
    private String password;
    private String role;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean isEnabled;

    private boolean isAccountNonExpired;
    private boolean isAccountNonLocked;
    private boolean isCredentialsNonExpired;

    public SecurityUser(Long id, String user_login_id, String password, String role) {
        this.id = id;
        this.user_login_id = user_login_id;
        this.password = password;
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> roles = new HashSet<>();
        for (String role : role.split(",")) {
            roles.add(new SimpleGrantedAuthority(role));
        }
        return roles;
    }

    public Long getId() {
        return this.id;
    }
    public void setId(Long id) { this.id = id; }


    @Override
    public String getUsername() {
        return this.user_login_id;
    }

    public void setUsername(String user_login_id) {
        this.user_login_id = user_login_id;
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
