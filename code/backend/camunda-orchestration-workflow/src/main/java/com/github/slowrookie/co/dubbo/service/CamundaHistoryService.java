package com.github.slowrookie.co.dubbo.service;


import com.github.slowrookie.co.dubbo.api.ICamundaHistoryService;
import com.github.slowrookie.co.dubbo.model.CamundaHistoricProcessInstance;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.history.HistoricProcessInstance;
import org.camunda.bpm.engine.history.HistoricProcessInstanceQuery;
import org.springframework.beans.BeanUtils;

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

}
