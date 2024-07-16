package com.github.slowrookie.co.dubbo.service;


import com.github.slowrookie.co.dubbo.api.ICamundaHistoryService;
import com.github.slowrookie.co.dubbo.model.CamundaHistoricActivityInstance;
import com.github.slowrookie.co.dubbo.model.CamundaHistoricProcessInstance;
import com.github.slowrookie.co.dubbo.model.CamundaHistoricTaskInstance;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.history.*;
import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.Set;

@DubboService
public class CamundaHistoryService implements ICamundaHistoryService {

    @Resource
    private HistoryService historyService;

    @Override
    public CamundaHistoricProcessInstance getHistoricProcessInstanceById(String processInstanceId) {
        HistoricProcessInstanceQuery historicProcessInstanceQuery = historyService.createHistoricProcessInstanceQuery();
        historicProcessInstanceQuery.processInstanceId(processInstanceId);
        HistoricProcessInstance processInstance = historicProcessInstanceQuery.singleResult();
        CamundaHistoricProcessInstance instance = new CamundaHistoricProcessInstance();
        if (processInstance == null) {
            return null;
        }
        BeanUtils.copyProperties(processInstance, instance);
        return instance;
    }

    @Override
    public List<CamundaHistoricProcessInstance> getHistoricProcessInstanceByIds(Set<String> processInstanceIds) {
        HistoricProcessInstanceQuery historicProcessInstanceQuery = historyService.createHistoricProcessInstanceQuery();
        historicProcessInstanceQuery.processInstanceIds(processInstanceIds);
        return historicProcessInstanceQuery.list().stream().map(v -> {
            CamundaHistoricProcessInstance instance = new CamundaHistoricProcessInstance();
            BeanUtils.copyProperties(v, instance);
            return instance;
        }).toList();
    }

    @Override
    public List<CamundaHistoricTaskInstance> getHistoricTaskInstance(String processInstanceId) {
        HistoricTaskInstanceQuery query = historyService.createHistoricTaskInstanceQuery();
        query.processInstanceId(processInstanceId);
        List<HistoricTaskInstance> taskInstances = query.list();
        return taskInstances.stream().map(v -> {
            CamundaHistoricTaskInstance instance = new CamundaHistoricTaskInstance();
            BeanUtils.copyProperties(v, instance);
            return instance;
        }).toList();
    }

    public List<CamundaHistoricActivityInstance> getHistoricActivityInstance(String processInstanceId) {
        HistoricActivityInstanceQuery query = historyService.createHistoricActivityInstanceQuery();
        query.processInstanceId(processInstanceId);
        query.orderByHistoricActivityInstanceEndTime().desc();
        List<HistoricActivityInstance> activityInstances = query.list();
        return activityInstances.stream().map(v -> {
            CamundaHistoricActivityInstance instance = new CamundaHistoricActivityInstance();
            BeanUtils.copyProperties(v, instance);
            return instance;
        }).toList();
    }

}
