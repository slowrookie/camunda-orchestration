package com.github.slowrookie.co.dubbo.api;

import com.github.slowrookie.co.dubbo.model.CamundaActivityInstance;
import com.github.slowrookie.co.dubbo.model.CamundaProcessInstance;

public interface ICamundaRuntimeService {

    CamundaProcessInstance startProcessInstanceById(String processDefinitionId, String businessKey) ;

    CamundaActivityInstance getActivityInstance(String processInstanceId);

}
