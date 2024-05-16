package com.github.slowrookie.co.auth.model;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.Collection;
import java.util.List;

/**
 * @author jiaxing.liu
 * @date 2024/5/16
 **/
@Data
public class CoUserDetail implements UserDetails {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String username;

    private String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return getId();
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

    public static CoUserDetail fromUser(User user) {
        CoUserDetail coUserDetail = new CoUserDetail();
        coUserDetail.setId(user.getId());
        coUserDetail.setUsername(user.getUsername());
        coUserDetail.setPassword(user.getPassword());
        return coUserDetail;
    }
}
