package com.github.slowrookie.co.biz.web;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Map;

/**
 * @author jiaxing.liu
 * @date 2024/5/16
 **/
@RestController
public class AuthenticationController {

    @GetMapping("/user")
    public void user(Authentication auth) {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        // 获取用户的主体信息，通常是用户的唯一标识符
        String principal = authentication.getName();

        // 获取用户的权限
        Collection<GrantedAuthority> authorities = authentication.getAuthorities();

        // 获取JWT的声明
        Map<String, Object> claims = authentication.getTokenAttributes();
    }

}
