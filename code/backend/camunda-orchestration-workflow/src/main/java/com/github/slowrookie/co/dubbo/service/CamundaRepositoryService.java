package com.github.slowrookie.co.dubbo.service;


import com.github.slowrookie.co.dubbo.api.ICamundaRepositoryService;
import com.github.slowrookie.co.dubbo.model.CamundaProcessDefinition;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.springframework.beans.BeanUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;

@DubboService
public class CamundaRepositoryService implements ICamundaRepositoryService {

    @Resource
    private RepositoryService repositoryService;

    public CamundaProcessDefinition getProcessDefinitionById(String processDefinitionId) {
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId).singleResult();
        if (processDefinition == null) {
            return null;
        }
        CamundaProcessDefinition camundaProcessDefinition = new CamundaProcessDefinition();
        BeanUtils.copyProperties(processDefinition, camundaProcessDefinition);
        return camundaProcessDefinition;
    }

    @Override
    public List<CamundaProcessDefinition> getProcessDefinitionByIds(Set<String> processDefinitionIds) {
        String[] ids = processDefinitionIds.toArray(new String[0]);
        return repositoryService.createProcessDefinitionQuery().processDefinitionIdIn(ids).list().stream().map(v -> {
            CamundaProcessDefinition camundaProcessDefinition = new CamundaProcessDefinition();
            BeanUtils.copyProperties(v, camundaProcessDefinition);
            return camundaProcessDefinition;
        }).toList();
    }

    @Override
    public String getProcessDefinitionBpmnXml(String processDefinitionId) {
        ProcessDefinition processDefinition = repositoryService.getProcessDefinition(processDefinitionId);
        if (processDefinition == null) {
            return null;
        }
        String deploymentId = processDefinition.getDeploymentId();
        String resourceName = processDefinition.getResourceName();
        try (InputStream bpmnStream = repositoryService.getResourceAsStream(deploymentId, resourceName)) {
            return new String(bpmnStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read BPMN XML", e);
        }
    }
}
