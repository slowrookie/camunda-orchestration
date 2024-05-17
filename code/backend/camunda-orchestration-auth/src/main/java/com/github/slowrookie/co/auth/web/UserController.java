package com.github.slowrookie.co.auth.web;

import com.github.slowrookie.co.auth.dto.UserCreateDto;
import com.github.slowrookie.co.auth.model.User;
import com.github.slowrookie.co.auth.service.IUserService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
public class UserController {

    @Resource
    private IUserService userService;

    @GetMapping("/users")
    @ResponseBody
    private Page<User> queryUsersByPage(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return userService.findAll(PageRequest.of(page, size));
    }

    @PutMapping("/user")
    private ResponseEntity<Object> create(@RequestBody @Valid UserCreateDto createUserDto) {
        User user = new User();
        user.setUsername(createUserDto.getUsername());
        user.setPassword(createUserDto.getPassword());
        user = userService.newUser(user);
        return ResponseEntity.ok(user);
    }

}
