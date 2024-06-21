package com.github.slowrookie.co.dubbo.model;


import lombok.Data;
import org.camunda.bpm.engine.runtime.TransitionInstance;

import java.io.Serial;
import java.io.Serializable;

@Data
public class CamundaTransitionInstance implements TransitionInstance, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String parentActivityInstanceId;

    private String processDefinitionId;

    private String processInstanceId;

    @Deprecated
    private String targetActivityId;

    private String activityId;

    private String executionId;

    private String activityType;

    private String activityName;

    private String[] incidentIds;

    private CamundaIncident[] incidents;


}
