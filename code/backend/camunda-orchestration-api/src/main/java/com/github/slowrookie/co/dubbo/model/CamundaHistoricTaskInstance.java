package com.github.slowrookie.co.dubbo.model;

import lombok.Data;
import org.camunda.bpm.engine.history.HistoricTaskInstance;
import org.camunda.bpm.engine.task.DelegationState;
import org.camunda.bpm.engine.task.Task;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
public class CamundaHistoricTaskInstance implements HistoricTaskInstance, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String processDefinitionKey;

    private String processDefinitionId;

    private String rootProcessInstanceId;

    private String processInstanceId;

    private String executionId;

    private String caseDefinitionKey;

    private String caseDefinitionId;

    private String caseInstanceId;

    private String caseExecutionId;

    private String activityInstanceId;

    private String name;

    private String description;

    private String deleteReason;

    private String owner;

    private String assignee;

    private Date startTime;

    private Date endTime;

    private Long durationInMillis;

    private String taskDefinitionKey;

    private int priority;

    private Date dueDate;

    private String parentTaskId;

    private Date followUpDate;

    private String tenantId;

    private Date removalTime;

}
