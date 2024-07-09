package com.github.slowrookie.co.dubbo.api;


import com.github.slowrookie.co.dubbo.model.CamundaHistoricProcessInstance;

public interface ICamundaHistoryService {

    CamundaHistoricProcessInstance getHistoricProcessInstanceById(String processInstanceId);

}
