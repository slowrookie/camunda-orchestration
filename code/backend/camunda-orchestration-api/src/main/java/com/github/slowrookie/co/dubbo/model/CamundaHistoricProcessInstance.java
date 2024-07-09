package com.github.slowrookie.co.dubbo.model;

import lombok.Data;
import org.camunda.bpm.engine.history.HistoricProcessInstance;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
public class CamundaHistoricProcessInstance implements HistoricProcessInstance, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String businessKey;

    private String processDefinitionKey;

    private String processDefinitionId;

    private String processDefinitionName;

    private Integer processDefinitionVersion;

    private Date startTime;

    private Date endTime;

    private Date removalTime;

    private Long durationInMillis;

    @Deprecated
    private String endActivityId;

    private String startUserId;

    private String startActivityId;

    private String deleteReason;

    private String superProcessInstanceId;

    private String rootProcessInstanceId;

    private String superCaseInstanceId;

    private String caseInstanceId;

    private String tenantId;

    private String state;


}
