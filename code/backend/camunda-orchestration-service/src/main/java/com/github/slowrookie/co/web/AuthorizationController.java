package com.github.slowrookie.co.web;

import com.github.slowrookie.co.dto.UserLoginDto;
import com.github.slowrookie.co.model.User;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author jiaxing.liu
 * @date 2024/5/10
 **/
@RestController
public class AuthorizationController {

    @Resource
    private AuthenticationManager authenticationManager;

    // custom login
    @PostMapping( "/authorization/login")
    @ResponseBody
    public ResponseEntity<Object> login(@RequestBody UserLoginDto dto, HttpSession session) {
        session.setAttribute("username", dto.getUsername());
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // return empty
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/me")
    @ResponseBody
    public ResponseEntity<User> me() {
        return ResponseEntity.ok((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }

}
