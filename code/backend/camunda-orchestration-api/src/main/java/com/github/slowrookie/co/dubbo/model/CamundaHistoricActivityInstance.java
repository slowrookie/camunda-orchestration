package com.github.slowrookie.co.dubbo.model;


import lombok.Data;
import org.camunda.bpm.engine.history.HistoricActivityInstance;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
public class CamundaHistoricActivityInstance implements HistoricActivityInstance, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String parentActivityInstanceId;

    private String activityId;

    private String activityName;

    private String activityType;

    private String processDefinitionKey;

    private String processDefinitionId;

    private String rootProcessInstanceId;

    private String processInstanceId;

    private String executionId;

    private String taskId;

    private String calledProcessInstanceId;

    private String calledCaseInstanceId;

    private String assignee;

    private Date startTime;

    private Date endTime;

    private Long durationInMillis;

    private boolean isCompleteScope;

    private boolean isCanceled;

    private String tenantId;

    private Date removalTime;

}
