package com.github.slowrookie.co.dubbo.model;

import lombok.Data;
import org.camunda.bpm.engine.task.DelegationState;
import org.camunda.bpm.engine.task.Task;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Data
public class CamundaTask implements Task, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String name;

    private String description;

    private int priority;

    private String owner;

    private String assignee;

    private DelegationState delegationState;

    private String processInstanceId;

    private String executionId;

    private String processDefinitionId;

    private String caseInstanceId;

    private String caseExecutionId;

    private String caseDefinitionId;

    private Date createTime;

    private Date lastUpdated;

    private String taskDefinitionKey;

    private Date dueDate;

    private Date followUpDate;

    private String parentTaskId;

    private boolean isSuspended;

    private String formKey;

    private CamundaFormRefEntity camundaFormRef;

    private String tenantId;

    @Override
    public void delegate(String userId) {
        setDelegationState(DelegationState.PENDING);
        if (getOwner() == null) {
            setOwner(getAssignee());
        }
        setAssignee(userId);
    }

    // Extensions
    private Set<String> candidateUsers;

    private Set<String> candidateGroups;

}
