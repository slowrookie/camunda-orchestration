package com.github.slowrookie.co.dubbo.api;


import com.github.slowrookie.co.dubbo.model.CamundaHistoricProcessInstance;
import com.github.slowrookie.co.dubbo.model.CamundaHistoricTaskInstance;

import java.util.List;
import java.util.Set;

public interface ICamundaHistoryService {

    CamundaHistoricProcessInstance getHistoricProcessInstanceById(String processInstanceId);

    List<CamundaHistoricProcessInstance> getHistoricProcessInstanceByIds(Set<String> processInstanceIds);

    List<CamundaHistoricTaskInstance> getHistoricTaskInstance(String processInstanceId);
}
