package com.github.slowrookie.co.dubbo.api;


import com.github.slowrookie.co.dubbo.model.CamundaProcessDefinition;

import java.util.List;
import java.util.Set;

public interface ICamundaRepositoryService {

    CamundaProcessDefinition getProcessDefinitionById(String processDefinitionId);

    List<CamundaProcessDefinition> getProcessDefinitionByIds(Set<String> processDefinitionIds);

    String getProcessDefinitionBpmnXml(String processDefinitionId);

}
