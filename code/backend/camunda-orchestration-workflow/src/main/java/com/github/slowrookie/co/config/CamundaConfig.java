package com.github.slowrookie.co.config;

import org.camunda.bpm.engine.spring.SpringProcessEngineConfiguration;
import org.camunda.bpm.spring.boot.starter.configuration.impl.AbstractCamundaConfiguration;
import org.springframework.context.annotation.Configuration;

/**
 * @author jiaxing.liu
 * @date 2024/5/11
 **/
@Configuration
public class CamundaConfig extends AbstractCamundaConfiguration {

    public void preInit(SpringProcessEngineConfiguration processEngineConfiguration) {
        processEngineConfiguration.setUserResourceWhitelistPattern("[a-zA-Z0-9-]+");
        processEngineConfiguration.setGroupResourceWhitelistPattern("[a-zA-Z0-9-]+");
        processEngineConfiguration.setTenantResourceWhitelistPattern("[a-zA-Z0-9-]+");
    }

}
