package com.github.slowrookie.co.biz;

import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableDubbo
@EnableJpaAuditing
@EnableTransactionManagement
public class CamundaOrchestrationBizApplication {

    public static void main(String[] args) {
        SpringApplication.run(CamundaOrchestrationBizApplication.class, args);
    }

}
