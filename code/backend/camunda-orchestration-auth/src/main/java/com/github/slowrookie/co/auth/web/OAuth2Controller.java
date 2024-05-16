package com.github.slowrookie.co.auth.web;


import com.github.slowrookie.co.auth.model.User;
import com.github.slowrookie.co.auth.service.IUserService;
import jakarta.annotation.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OAuth2Controller {

    @Resource
    private IUserService userService;

    // me
    @GetMapping("oauth2/me")
    public ResponseEntity<User> me(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(userService.getUser(userId));
    }


}
