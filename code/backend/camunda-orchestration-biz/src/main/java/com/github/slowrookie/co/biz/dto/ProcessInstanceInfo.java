package com.github.slowrookie.co.biz.dto;

import com.github.slowrookie.co.dubbo.model.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProcessInstanceInfo {

    private CamundaProcessDefinition processDefinition;

    private CamundaHistoricProcessInstance processInstance;

    private List<CamundaTask> currentTasks = new ArrayList<>();

    private List<CamundaHistoricTaskInstance> userTasks = new ArrayList<>();

    private List<CamundaHistoricActivityInstance> activityInstances = new ArrayList<>();

    private String bpmn20Xml;
}
