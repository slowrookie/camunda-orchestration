package com.github.slowrookie.co.biz.dto;


import com.github.slowrookie.co.biz.model.WorkflowApproval;
import com.github.slowrookie.co.dubbo.model.CamundaHistoricProcessInstance;
import com.github.slowrookie.co.dubbo.model.CamundaProcessDefinition;
import com.github.slowrookie.co.dubbo.model.CamundaTask;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class WorkflowApprovalRes extends WorkflowApproval {

    private CamundaTask currentTask;

    private CamundaProcessDefinition processDefinition;

    private CamundaHistoricProcessInstance processInstance;

}
