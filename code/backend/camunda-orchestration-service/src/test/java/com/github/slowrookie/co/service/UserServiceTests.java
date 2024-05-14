package com.github.slowrookie.co.service;

import com.github.slowrookie.co.model.User;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserServiceTests {

    @Resource
    private IUserService userService;

    @Test
    void contextLoads() {
    }

    @Test
    public void saveUser() {
        User user = new User();
        user.setUsername("admin");
        user.setPassword("admin");
        userService.newUser(user);
    }

    @Test
    public void saveUsers() {
        // 26个大写字母创建用户
        for (int i = 65; i < 91; i++) {
            User user = new User();
            user.setUsername(String.format("User%s", (char) i));
            user.setPassword(String.format("User%s", (char) i));
            userService.newUser(user);
        }
    }

}
