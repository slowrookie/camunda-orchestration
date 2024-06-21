package com.github.slowrookie.co.dubbo.api;

import com.github.slowrookie.co.dubbo.model.CamundaActivityInstance;
import com.github.slowrookie.co.dubbo.model.CamundaProcessInstance;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ActivityInstance;

public interface ICamundaRuntimeService extends RuntimeService {

    CamundaProcessInstance startProcessInstanceById(String processDefinitionId, String businessKey) ;

    CamundaActivityInstance getActivityInstance(String processInstanceId);
}
