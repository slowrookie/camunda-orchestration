package com.github.slowrookie.co.dubbo.model;


import lombok.Data;
import org.camunda.bpm.engine.runtime.Incident;
import org.camunda.bpm.engine.runtime.TransitionInstance;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
public class CamundaIncident implements Incident, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private Date incidentTimestamp;

    private String incidentType;

    private String incidentMessage;

    private String executionId;

    private String activityId;

    private String failedActivityId;

    private String processInstanceId;

    private String processDefinitionId;

    private String causeIncidentId;

    private String rootCauseIncidentId;

    private String configuration;

    private String tenantId;

    private String jobDefinitionId;

    private String historyConfiguration;

    private String annotation;

}
