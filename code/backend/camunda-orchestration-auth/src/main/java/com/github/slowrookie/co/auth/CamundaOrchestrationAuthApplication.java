package com.github.slowrookie.co;

import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableDubbo
public class CamundaOrchestrationAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(CamundaOrchestrationAuthApplication.class, args);
    }

}
