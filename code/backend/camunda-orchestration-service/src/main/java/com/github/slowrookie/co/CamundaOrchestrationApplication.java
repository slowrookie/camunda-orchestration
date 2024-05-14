package com.github.slowrookie.co;

import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisIndexedHttpSession;

@SpringBootApplication
@EnableDubbo
@EnableWebSecurity
@EnableRedisIndexedHttpSession
//@EnableRedisHttpSession
public class CamundaOrchestrationApplication {

    public static void main(String[] args) {
        SpringApplication.run(CamundaOrchestrationApplication.class, args);
    }

}
