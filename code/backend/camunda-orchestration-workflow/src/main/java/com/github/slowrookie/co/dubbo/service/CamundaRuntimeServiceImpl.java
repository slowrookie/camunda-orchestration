package com.github.slowrookie.co.dubbo.service;

import com.github.slowrookie.co.dubbo.api.ICamundaRuntimeService;
import com.github.slowrookie.co.dubbo.model.CamundaActivityInstance;
import com.github.slowrookie.co.dubbo.model.CamundaProcessInstance;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.batch.Batch;
import org.camunda.bpm.engine.history.HistoricProcessInstanceQuery;
import org.camunda.bpm.engine.migration.MigrationPlan;
import org.camunda.bpm.engine.migration.MigrationPlanBuilder;
import org.camunda.bpm.engine.migration.MigrationPlanExecutionBuilder;
import org.camunda.bpm.engine.runtime.*;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.value.TypedValue;
import org.springframework.beans.BeanUtils;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@DubboService
public class CamundaRuntimeServiceImpl implements ICamundaRuntimeService {

    @Resource
    private RuntimeService runtimeService;

    @Override
    public ProcessInstance startProcessInstanceByKey(String processDefinitionKey) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey);
    }

    @Override
    public ProcessInstance startProcessInstanceByKey(String processDefinitionKey, String businessKey) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey, businessKey);
    }

    @Override
    public ProcessInstance startProcessInstanceByKey(String processDefinitionKey, String businessKey, String caseInstanceId) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey, businessKey, caseInstanceId);
    }

    @Override
    public ProcessInstance startProcessInstanceByKey(String processDefinitionKey, Map<String, Object> variables) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey, variables);
    }

    @Override
    public ProcessInstance startProcessInstanceByKey(String processDefinitionKey, String businessKey, Map<String, Object> variables) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey, businessKey, variables);
    }

    @Override
    public ProcessInstance startProcessInstanceByKey(String processDefinitionKey, String businessKey, String caseInstanceId, Map<String, Object> variables) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey, businessKey, caseInstanceId, variables);
    }

    @Override
    public ProcessInstance startProcessInstanceById(String processDefinitionId) {
        return runtimeService.startProcessInstanceById(processDefinitionId);
    }

    @Override
    public CamundaProcessInstance startProcessInstanceById(String processDefinitionId, String businessKey) {
        ProcessInstance processInstance = runtimeService.startProcessInstanceById(processDefinitionId, businessKey);
        CamundaProcessInstance instance = new CamundaProcessInstance();
        BeanUtils.copyProperties(processInstance, instance);
        return instance;
    }

    @Override
    public ProcessInstance startProcessInstanceById(String processDefinitionId, String businessKey, String caseInstanceId) {
        return runtimeService.startProcessInstanceById(processDefinitionId, businessKey, caseInstanceId);
    }

    @Override
    public ProcessInstance startProcessInstanceById(String processDefinitionId, Map<String, Object> variables) {
        return runtimeService.startProcessInstanceById(processDefinitionId, variables);
    }

    @Override
    public ProcessInstance startProcessInstanceById(String processDefinitionId, String businessKey, Map<String, Object> variables) {
        return runtimeService.startProcessInstanceById(processDefinitionId, businessKey, variables);
    }

    @Override
    public ProcessInstance startProcessInstanceById(String processDefinitionId, String businessKey, String caseInstanceId, Map<String, Object> variables) {
        return runtimeService.startProcessInstanceById(processDefinitionId, businessKey, caseInstanceId, variables);
    }

    @Override
    public ProcessInstance startProcessInstanceByMessage(String messageName) {
        return runtimeService.startProcessInstanceByMessage(messageName);
    }

    @Override
    public ProcessInstance startProcessInstanceByMessage(String messageName, String businessKey) {
        return runtimeService.startProcessInstanceByMessage(messageName, businessKey);
    }

    @Override
    public ProcessInstance startProcessInstanceByMessage(String messageName, Map<String, Object> processVariables) {
        return runtimeService.startProcessInstanceByMessage(messageName, processVariables);
    }

    @Override
    public ProcessInstance startProcessInstanceByMessage(String messageName, String businessKey, Map<String, Object> processVariables) {
        return runtimeService.startProcessInstanceByMessage(messageName, businessKey, processVariables);
    }

    @Override
    public ProcessInstance startProcessInstanceByMessageAndProcessDefinitionId(String messageName, String processDefinitionId) {
        return runtimeService.startProcessInstanceByMessageAndProcessDefinitionId(messageName, processDefinitionId);
    }

    @Override
    public ProcessInstance startProcessInstanceByMessageAndProcessDefinitionId(String messageName, String processDefinitionId, String businessKey) {
        return runtimeService.startProcessInstanceByMessageAndProcessDefinitionId(messageName, processDefinitionId, businessKey);
    }

    @Override
    public ProcessInstance startProcessInstanceByMessageAndProcessDefinitionId(String messageName, String processDefinitionId, Map<String, Object> processVariables) {
        return runtimeService.startProcessInstanceByMessageAndProcessDefinitionId(messageName, processDefinitionId, processVariables);
    }

    @Override
    public ProcessInstance startProcessInstanceByMessageAndProcessDefinitionId(String messageName, String processDefinitionId, String businessKey, Map<String, Object> processVariables) {
        return runtimeService.startProcessInstanceByMessageAndProcessDefinitionId(messageName, processDefinitionId, businessKey, processVariables);
    }

    @Override
    public void deleteProcessInstance(String processInstanceId, String deleteReason) {
        runtimeService.deleteProcessInstance(processInstanceId, deleteReason);
    }

    @Override
    public Batch deleteProcessInstancesAsync(List<String> processInstanceIds, ProcessInstanceQuery processInstanceQuery, String deleteReason) {
        return runtimeService.deleteProcessInstancesAsync(processInstanceIds, processInstanceQuery, deleteReason);
    }

    @Override
    public Batch deleteProcessInstancesAsync(List<String> processInstanceIds, ProcessInstanceQuery processInstanceQuery, String deleteReason, boolean skipCustomListeners) {
        return runtimeService.deleteProcessInstancesAsync(processInstanceIds, processInstanceQuery, deleteReason, skipCustomListeners);
    }

    @Override
    public Batch deleteProcessInstancesAsync(List<String> processInstanceIds, ProcessInstanceQuery processInstanceQuery, String deleteReason, boolean skipCustomListeners, boolean skipSubprocesses) {
        return runtimeService.deleteProcessInstancesAsync(processInstanceIds, processInstanceQuery, deleteReason, skipCustomListeners, skipSubprocesses);
    }

    @Override
    public Batch deleteProcessInstancesAsync(List<String> processInstanceIds, ProcessInstanceQuery processInstanceQuery, HistoricProcessInstanceQuery historicProcessInstanceQuery, String deleteReason, boolean skipCustomListeners, boolean skipSubprocesses) {
        return runtimeService.deleteProcessInstancesAsync(processInstanceIds, processInstanceQuery, historicProcessInstanceQuery, deleteReason, skipCustomListeners, skipSubprocesses);
    }

    @Override
    public Batch deleteProcessInstancesAsync(List<String> processInstanceIds, ProcessInstanceQuery processInstanceQuery, HistoricProcessInstanceQuery historicProcessInstanceQuery, String deleteReason, boolean skipCustomListeners, boolean skipSubprocesses, boolean skipIoMappings) {
        return runtimeService.deleteProcessInstancesAsync(processInstanceIds, processInstanceQuery, historicProcessInstanceQuery, deleteReason, skipCustomListeners, skipSubprocesses, skipIoMappings);
    }

    @Override
    public Batch deleteProcessInstancesAsync(ProcessInstanceQuery processInstanceQuery, String deleteReason) {
        return runtimeService.deleteProcessInstancesAsync(processInstanceQuery, deleteReason);
    }

    @Override
    public Batch deleteProcessInstancesAsync(List<String> processInstanceIds, String deleteReason) {
        return runtimeService.deleteProcessInstancesAsync(processInstanceIds, deleteReason);
    }

    @Override
    public void deleteProcessInstance(String processInstanceId, String deleteReason, boolean skipCustomListeners) {
        runtimeService.deleteProcessInstance(processInstanceId, deleteReason, skipCustomListeners);
    }

    @Override
    public void deleteProcessInstance(String processInstanceId, String deleteReason, boolean skipCustomListeners, boolean externallyTerminated) {
        runtimeService.deleteProcessInstance(processInstanceId, deleteReason, skipCustomListeners, externallyTerminated);
    }

    @Override
    public void deleteProcessInstances(List<String> processInstanceIds, String deleteReason, boolean skipCustomListeners, boolean externallyTerminated) {
        runtimeService.deleteProcessInstances(processInstanceIds, deleteReason, skipCustomListeners, externallyTerminated);
    }

    @Override
    public void deleteProcessInstances(List<String> processInstanceIds, String deleteReason, boolean skipCustomListeners, boolean externallyTerminated, boolean skipSubprocesses) {
        runtimeService.deleteProcessInstances(processInstanceIds, deleteReason, skipCustomListeners, externallyTerminated, skipSubprocesses);
    }

    @Override
    public void deleteProcessInstances(List<String> processInstanceIds, String deleteReason, boolean skipCustomListeners, boolean externallyTerminated, boolean skipSubprocesses, boolean skipIoMappings) {
        runtimeService.deleteProcessInstances(processInstanceIds, deleteReason, skipCustomListeners, externallyTerminated, skipSubprocesses, skipIoMappings);
    }

    @Override
    public void deleteProcessInstancesIfExists(List<String> processInstanceIds, String deleteReason, boolean skipCustomListeners, boolean externallyTerminated, boolean skipSubprocesses) {
        runtimeService.deleteProcessInstancesIfExists(processInstanceIds, deleteReason, skipCustomListeners, externallyTerminated, skipSubprocesses);
    }

    @Override
    public void deleteProcessInstance(String processInstanceId, String deleteReason, boolean skipCustomListeners, boolean externallyTerminated, boolean skipIoMappings) {
        runtimeService.deleteProcessInstance(processInstanceId, deleteReason, skipCustomListeners, externallyTerminated, skipIoMappings);
    }

    @Override
    public void deleteProcessInstance(String processInstanceId, String deleteReason, boolean skipCustomListeners, boolean externallyTerminated, boolean skipIoMappings, boolean skipSubprocesses) {
        runtimeService.deleteProcessInstance(processInstanceId, deleteReason, skipCustomListeners, externallyTerminated, skipIoMappings, skipSubprocesses);
    }

    @Override
    public void deleteProcessInstanceIfExists(String processInstanceId, String deleteReason, boolean skipCustomListeners, boolean externallyTerminated, boolean skipIoMappings, boolean skipSubprocesses) {
        runtimeService.deleteProcessInstanceIfExists(processInstanceId, deleteReason, skipCustomListeners, externallyTerminated, skipIoMappings, skipSubprocesses);
    }

    @Override
    public List<String> getActiveActivityIds(String executionId) {
        return runtimeService.getActiveActivityIds(executionId);
    }

    @Override
    public CamundaActivityInstance getActivityInstance(String processInstanceId) {
        ActivityInstance activityInstance = runtimeService.getActivityInstance(processInstanceId);
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


    @Override
    public void signal(String executionId) {
        runtimeService.signal(executionId);
    }

    @Override
    public void signal(String executionId, String signalName, Object signalData, Map<String, Object> processVariables) {
        runtimeService.signal(executionId, signalName, signalData, processVariables);
    }

    @Override
    public void signal(String executionId, Map<String, Object> processVariables) {
        runtimeService.signal(executionId, processVariables);
    }

    @Override
    public Map<String, Object> getVariables(String executionId) {
        return runtimeService.getVariables(executionId);
    }

    @Override
    public VariableMap getVariablesTyped(String executionId) {
        return runtimeService.getVariablesTyped(executionId);
    }

    @Override
    public VariableMap getVariablesTyped(String executionId, boolean deserializeValues) {
        return runtimeService.getVariablesTyped(executionId, deserializeValues);
    }

    @Override
    public Map<String, Object> getVariablesLocal(String executionId) {
        return runtimeService.getVariablesLocal(executionId);
    }

    @Override
    public VariableMap getVariablesLocalTyped(String executionId) {
        return runtimeService.getVariablesLocalTyped(executionId);
    }

    @Override
    public VariableMap getVariablesLocalTyped(String executionId, boolean deserializeValues) {
        return runtimeService.getVariablesLocalTyped(executionId, deserializeValues);
    }

    @Override
    public Map<String, Object> getVariables(String executionId, Collection<String> variableNames) {
        return runtimeService.getVariables(executionId, variableNames);
    }

    @Override
    public VariableMap getVariablesTyped(String executionId, Collection<String> variableNames, boolean deserializeValues) {
        return runtimeService.getVariablesTyped(executionId, variableNames, deserializeValues);
    }

    @Override
    public Map<String, Object> getVariablesLocal(String executionId, Collection<String> variableNames) {
        return runtimeService.getVariablesLocal(executionId, variableNames);
    }

    @Override
    public VariableMap getVariablesLocalTyped(String executionId, Collection<String> variableNames, boolean deserializeValues) {
        return runtimeService.getVariablesLocalTyped(executionId, variableNames, deserializeValues);
    }

    @Override
    public Object getVariable(String executionId, String variableName) {
        return runtimeService.getVariable(executionId, variableName);
    }

    @Override
    public <T extends TypedValue> T getVariableTyped(String executionId, String variableName) {
        return runtimeService.getVariableTyped(executionId, variableName);
    }

    @Override
    public <T extends TypedValue> T getVariableTyped(String executionId, String variableName, boolean deserializeValue) {
        return runtimeService.getVariableTyped(executionId, variableName, deserializeValue);
    }

    @Override
    public Object getVariableLocal(String executionId, String variableName) {
        return runtimeService.getVariableLocal(executionId, variableName);
    }

    @Override
    public <T extends TypedValue> T getVariableLocalTyped(String executionId, String variableName) {
        return runtimeService.getVariableLocalTyped(executionId, variableName);
    }

    @Override
    public <T extends TypedValue> T getVariableLocalTyped(String executionId, String variableName, boolean deserializeValue) {
        return runtimeService.getVariableLocalTyped(executionId, variableName, deserializeValue);
    }

    @Override
    public void setVariable(String executionId, String variableName, Object value) {
        runtimeService.setVariable(executionId, variableName, value);
    }

    @Override
    public void setVariableLocal(String executionId, String variableName, Object value) {
        runtimeService.setVariableLocal(executionId, variableName, value);
    }

    @Override
    public void setVariables(String executionId, Map<String, ?> variables) {
        runtimeService.setVariables(executionId, variables);
    }

    @Override
    public void setVariablesLocal(String executionId, Map<String, ?> variables) {
        runtimeService.setVariablesLocal(executionId, variables);
    }

    @Override
    public Batch setVariablesAsync(List<String> processInstanceIds, ProcessInstanceQuery processInstanceQuery, HistoricProcessInstanceQuery historicProcessInstanceQuery, Map<String, ?> variables) {
        return runtimeService.setVariablesAsync(processInstanceIds, processInstanceQuery, historicProcessInstanceQuery, variables);
    }

    @Override
    public Batch setVariablesAsync(List<String> processInstanceIds, Map<String, ?> variables) {
        return runtimeService.setVariablesAsync(processInstanceIds, variables);
    }

    @Override
    public Batch setVariablesAsync(ProcessInstanceQuery processInstanceQuery, Map<String, ?> variables) {
        return runtimeService.setVariablesAsync(processInstanceQuery, variables);
    }

    @Override
    public Batch setVariablesAsync(HistoricProcessInstanceQuery historicProcessInstanceQuery, Map<String, ?> variables) {
        return runtimeService.setVariablesAsync(historicProcessInstanceQuery, variables);
    }

    @Override
    public void removeVariable(String executionId, String variableName) {
        runtimeService.removeVariable(executionId, variableName);
    }

    @Override
    public void removeVariableLocal(String executionId, String variableName) {
        runtimeService.removeVariableLocal(executionId, variableName);
    }

    @Override
    public void removeVariables(String executionId, Collection<String> variableNames) {
        runtimeService.removeVariables(executionId, variableNames);
    }

    @Override
    public void removeVariablesLocal(String executionId, Collection<String> variableNames) {
        runtimeService.removeVariablesLocal(executionId, variableNames);
    }

    @Override
    public ExecutionQuery createExecutionQuery() {
        return runtimeService.createExecutionQuery();
    }

    @Override
    public NativeExecutionQuery createNativeExecutionQuery() {
        return runtimeService.createNativeExecutionQuery();
    }

    @Override
    public ProcessInstanceQuery createProcessInstanceQuery() {
        return runtimeService.createProcessInstanceQuery();
    }

    @Override
    public NativeProcessInstanceQuery createNativeProcessInstanceQuery() {
        return runtimeService.createNativeProcessInstanceQuery();
    }

    @Override
    public IncidentQuery createIncidentQuery() {
        return runtimeService.createIncidentQuery();
    }

    @Override
    public EventSubscriptionQuery createEventSubscriptionQuery() {
        return runtimeService.createEventSubscriptionQuery();
    }

    @Override
    public VariableInstanceQuery createVariableInstanceQuery() {
        return runtimeService.createVariableInstanceQuery();
    }

    @Override
    public void suspendProcessInstanceById(String processInstanceId) {
        runtimeService.suspendProcessInstanceById(processInstanceId);
    }

    @Override
    public void suspendProcessInstanceByProcessDefinitionId(String processDefinitionId) {
        runtimeService.suspendProcessInstanceByProcessDefinitionId(processDefinitionId);
    }

    @Override
    public void suspendProcessInstanceByProcessDefinitionKey(String processDefinitionKey) {
        runtimeService.suspendProcessInstanceByProcessDefinitionKey(processDefinitionKey);
    }

    @Override
    public void activateProcessInstanceById(String processInstanceId) {
        runtimeService.activateProcessInstanceById(processInstanceId);
    }

    @Override
    public void activateProcessInstanceByProcessDefinitionId(String processDefinitionId) {
        runtimeService.activateProcessInstanceByProcessDefinitionId(processDefinitionId);
    }

    @Override
    public void activateProcessInstanceByProcessDefinitionKey(String processDefinitionKey) {
        runtimeService.activateProcessInstanceByProcessDefinitionKey(processDefinitionKey);
    }

    @Override
    public UpdateProcessInstanceSuspensionStateSelectBuilder updateProcessInstanceSuspensionState() {
        return runtimeService.updateProcessInstanceSuspensionState();
    }

    @Override
    public void signalEventReceived(String signalName) {
        runtimeService.signalEventReceived(signalName);
    }

    @Override
    public void signalEventReceived(String signalName, Map<String, Object> processVariables) {
        runtimeService.signalEventReceived(signalName, processVariables);
    }

    @Override
    public void signalEventReceived(String signalName, String executionId) {
        runtimeService.signalEventReceived(signalName, executionId);
    }

    @Override
    public void signalEventReceived(String signalName, String executionId, Map<String, Object> processVariables) {
        runtimeService.signalEventReceived(signalName, executionId, processVariables);
    }

    @Override
    public SignalEventReceivedBuilder createSignalEvent(String signalName) {
        return runtimeService.createSignalEvent(signalName);
    }

    @Override
    public void messageEventReceived(String messageName, String executionId) {
        runtimeService.messageEventReceived(messageName, executionId);
    }

    @Override
    public void messageEventReceived(String messageName, String executionId, Map<String, Object> processVariables) {
        runtimeService.messageEventReceived(messageName, executionId, processVariables);
    }

    @Override
    public MessageCorrelationBuilder createMessageCorrelation(String messageName) {
        return runtimeService.createMessageCorrelation(messageName);
    }

    @Override
    public void correlateMessage(String messageName) {
        runtimeService.correlateMessage(messageName);
    }

    @Override
    public void correlateMessage(String messageName, String businessKey) {
        runtimeService.correlateMessage(messageName, businessKey);
    }

    @Override
    public void correlateMessage(String messageName, Map<String, Object> correlationKeys) {
        runtimeService.correlateMessage(messageName, correlationKeys);
    }

    @Override
    public void correlateMessage(String messageName, String businessKey, Map<String, Object> processVariables) {
        runtimeService.correlateMessage(messageName, businessKey, processVariables);
    }

    @Override
    public void correlateMessage(String messageName, Map<String, Object> correlationKeys, Map<String, Object> processVariables) {
        runtimeService.correlateMessage(messageName, correlationKeys, processVariables);
    }

    @Override
    public void correlateMessage(String messageName, String businessKey, Map<String, Object> correlationKeys, Map<String, Object> processVariables) {
        runtimeService.correlateMessage(messageName, businessKey, correlationKeys, processVariables);
    }

    @Override
    public MessageCorrelationAsyncBuilder createMessageCorrelationAsync(String messageName) {
        return runtimeService.createMessageCorrelationAsync(messageName);
    }

    @Override
    public ProcessInstanceModificationBuilder createProcessInstanceModification(String processInstanceId) {
        return runtimeService.createProcessInstanceModification(processInstanceId);
    }

    @Override
    public ProcessInstantiationBuilder createProcessInstanceById(String processDefinitionId) {
        return runtimeService.createProcessInstanceById(processDefinitionId);
    }

    @Override
    public ProcessInstantiationBuilder createProcessInstanceByKey(String processDefinitionKey) {
        return runtimeService.createProcessInstanceByKey(processDefinitionKey);
    }

    @Override
    public MigrationPlanBuilder createMigrationPlan(String sourceProcessDefinitionId, String targetProcessDefinitionId) {
        return runtimeService.createMigrationPlan(sourceProcessDefinitionId, targetProcessDefinitionId);
    }

    @Override
    public MigrationPlanExecutionBuilder newMigration(MigrationPlan migrationPlan) {
        return runtimeService.newMigration(migrationPlan);
    }

    @Override
    public ModificationBuilder createModification(String processDefinitionId) {
        return runtimeService.createModification(processDefinitionId);
    }

    @Override
    public RestartProcessInstanceBuilder restartProcessInstances(String processDefinitionId) {
        return runtimeService.restartProcessInstances(processDefinitionId);
    }

    @Override
    public Incident createIncident(String incidentType, String executionId, String configuration) {
        return runtimeService.createIncident(incidentType, executionId, configuration);
    }

    @Override
    public Incident createIncident(String incidentType, String executionId, String configuration, String message) {
        return runtimeService.createIncident(incidentType, executionId, configuration, message);
    }

    @Override
    public void resolveIncident(String incidentId) {
        runtimeService.resolveIncident(incidentId);
    }

    @Override
    public void setAnnotationForIncidentById(String incidentId, String annotation) {
        runtimeService.setAnnotationForIncidentById(incidentId, annotation);
    }

    @Override
    public void clearAnnotationForIncidentById(String incidentId) {
        runtimeService.clearAnnotationForIncidentById(incidentId);
    }

    @Override
    public ConditionEvaluationBuilder createConditionEvaluation() {
        return runtimeService.createConditionEvaluation();
    }
}
