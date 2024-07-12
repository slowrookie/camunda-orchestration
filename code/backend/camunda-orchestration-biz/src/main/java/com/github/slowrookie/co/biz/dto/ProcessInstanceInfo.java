package com.github.slowrookie.co.biz.dto;

import com.github.slowrookie.co.dubbo.model.CamundaHistoricProcessInstance;
import com.github.slowrookie.co.dubbo.model.CamundaHistoricTaskInstance;
import com.github.slowrookie.co.dubbo.model.CamundaProcessDefinition;
import com.github.slowrookie.co.dubbo.model.CamundaTask;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @author jiaxing.liu
 * @date 2024/7/12
 **/
@Data
public class ProcessInstanceInfo {

    private CamundaProcessDefinition processDefinition;

    private CamundaHistoricProcessInstance processInstance;

    private List<CamundaTask> currentTasks = new ArrayList<>();

    private List<CamundaHistoricTaskInstance> historicTasks = new ArrayList<>();

    private String bpmn20Xml;
}
