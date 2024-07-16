package com.github.slowrookie.co.auth.web;


import com.github.slowrookie.co.auth.dto.UserDto;
import com.github.slowrookie.co.auth.model.User;
import com.github.slowrookie.co.auth.service.IUserService;
import jakarta.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class OAuth2Controller {

    @Resource
    private IUserService userService;

    // me
    @GetMapping("oauth2/me")
    @ResponseBody
    public ResponseEntity<UserDto> me(Authentication auth) {
        String userId = auth.getName();
        Optional<User> up = userService.getUser(userId);
        if (up.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(up.get(), userDto);
        return ResponseEntity.ok(userDto);
    }


}
