package com.github.slowrookie.co.auth;


import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public class PasswordEncoderTest {

    @Resource
    private PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
    }

    @Test
    public void encoder() {
        String encoderStr = passwordEncoder.encode("frontend");
        System.out.println(encoderStr);
    }

}
