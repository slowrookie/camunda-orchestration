package com.github.slowrookie.co.dubbo.service;

import com.github.slowrookie.co.dubbo.api.ICamundaRuntimeService;
import com.github.slowrookie.co.dubbo.model.CamundaActivityInstance;
import com.github.slowrookie.co.dubbo.model.CamundaProcessInstance;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ActivityInstance;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.beans.BeanUtils;

import java.util.Arrays;
import java.util.List;

@DubboService
public class CamundaRuntimeServiceImpl implements ICamundaRuntimeService {

    @Resource
    private RuntimeService runtimeService;

    @Override
    public CamundaProcessInstance startProcessInstanceById(String processDefinitionId, String businessKey) {
        ProcessInstance processInstance = runtimeService.startProcessInstanceById(processDefinitionId, businessKey);
        CamundaProcessInstance instance = new CamundaProcessInstance();
        BeanUtils.copyProperties(processInstance, instance);
        return instance;
    }

    @Override
    public CamundaActivityInstance getActivityInstance(String processInstanceId) {
        ActivityInstance activityInstance = runtimeService.getActivityInstance(processInstanceId);
        if (activityInstance == null) {
            return null;
        }
        CamundaActivityInstance instance = new CamundaActivityInstance();
        BeanUtils.copyProperties(activityInstance, instance);
        List<CamundaActivityInstance> camundaActivityInstances = Arrays.stream(activityInstance.getChildActivityInstances()).map(v -> {
            CamundaActivityInstance childInstance = new CamundaActivityInstance();
            BeanUtils.copyProperties(v, childInstance);
            return childInstance;
        }).toList();

        instance.setChildActivityInstances(camundaActivityInstances.toArray(new CamundaActivityInstance[camundaActivityInstances.size()]));
        return instance;
    }

}
