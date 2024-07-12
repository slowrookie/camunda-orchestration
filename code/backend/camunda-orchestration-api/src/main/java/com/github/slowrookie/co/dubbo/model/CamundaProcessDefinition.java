package com.github.slowrookie.co.dubbo.model;


import lombok.Data;
import org.camunda.bpm.engine.repository.ProcessDefinition;

import java.io.Serial;
import java.io.Serializable;

@Data
public class CamundaProcessDefinition implements ProcessDefinition, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String category;

    private String name;

    private String key;

    private int version;

    private String resourceName;

    private String deploymentId;

    private String diagramResourceName;

    private String tenantId;

    private Integer historyTimeToLive;

    private String description;

    boolean hasStartFormKey;

    boolean isSuspended;

    String versionTag;

    boolean isStartableInTasklist;

    @Override
    public boolean hasStartFormKey() {
        return hasStartFormKey;
    }

    public void hasStartFormKey(boolean hasStartFormKey) {
        this.hasStartFormKey = hasStartFormKey;
    }

}
