package com.github.slowrookie.co.dubbo.model;

import lombok.Data;
import org.camunda.bpm.engine.runtime.ProcessInstance;

import java.io.Serial;
import java.io.Serializable;

@Data
public class CamundaProcessInstance implements ProcessInstance, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String processDefinitionId;

    private String businessKey;

    private String rootProcessInstanceId;

    private String caseInstanceId;

    private String id;

    private boolean suspended;

    private boolean ended;

    private String processInstanceId;

    private String tenantId;

}
