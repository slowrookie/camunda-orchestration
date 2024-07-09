package com.github.slowrookie.co.biz.service.impl;

import com.github.slowrookie.auth.dubbo.api.IAuthUserService;
import com.github.slowrookie.auth.dubbo.model.AuthUser;
import com.github.slowrookie.co.biz.dto.WorkflowApprovalStartDto;
import com.github.slowrookie.co.biz.model.FormData;
import com.github.slowrookie.co.biz.model.FormDefDetail;
import com.github.slowrookie.co.biz.model.WorkflowApproval;
import com.github.slowrookie.co.biz.repository.IFormDataRepository;
import com.github.slowrookie.co.biz.repository.IFormDefDetailRepository;
import com.github.slowrookie.co.biz.repository.IWorkflowApprovalRepository;
import com.github.slowrookie.co.biz.service.IWorkflowApprovalService;
import com.github.slowrookie.co.dubbo.api.ICamundaHistoryService;
import com.github.slowrookie.co.dubbo.api.ICamundaRuntimeService;
import com.github.slowrookie.co.dubbo.api.ICamundaTaskService;
import com.github.slowrookie.co.dubbo.model.CamundaActivityInstance;
import com.github.slowrookie.co.dubbo.model.CamundaHistoricProcessInstance;
import com.github.slowrookie.co.dubbo.model.CamundaProcessInstance;
import com.github.slowrookie.co.dubbo.model.CamundaTask;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboReference;
import org.camunda.bpm.engine.runtime.ActivityInstance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class WorkflowApprovalServiceImpl implements IWorkflowApprovalService {

    @Resource
    private IWorkflowApprovalRepository workflowApprovalRepository;
    @Resource
    private IFormDefDetailRepository formDefDetailRepository;
    @Resource
    private IFormDataRepository formDataRepository;
    @DubboReference
    private IAuthUserService userService;
    @DubboReference
    private ICamundaRuntimeService camundaRuntimeService;
    @DubboReference
    private ICamundaTaskService camundaTaskService;
    @DubboReference
    private ICamundaHistoryService historyService;

    @Override
    public WorkflowApproval getById(String id) {
        return workflowApprovalRepository.findById(id).orElse(null);
    }

    @Override
    public Page<WorkflowApproval> findAll(PageRequest of) {
        Page<WorkflowApproval> workflowApprovals = workflowApprovalRepository.findAll(of);
        List<AuthUser> users = userService.getUsers(workflowApprovals.stream().map(WorkflowApproval::getCreatedBy).collect(Collectors.toList()));
        workflowApprovals.getContent().forEach(workflowApproval -> {
            users.forEach(user -> {
                if (workflowApproval.getCreatedBy().equals(user.getId())) {
                    workflowApproval.setCreatedBy(user.getUsername());
                }

                // get current node
                CamundaActivityInstance activityInstance = camundaRuntimeService.getActivityInstance(workflowApproval.getProcessInstanceId());
                if (null == activityInstance) {
                    return;
                }
                // last one
                ActivityInstance[] activityInstances = activityInstance.getChildActivityInstances();
                if (activityInstances.length > 0) {
                    workflowApproval.setLatestProcessInstanceNode(activityInstances[activityInstances.length - 1].getActivityName());
                }
            });
        });
        return workflowApprovals;
    }

    @Override
    public Page<WorkflowApproval> findAllPending(String userId, List<String> processInstanceIds, PageRequest of) {
        Page<WorkflowApproval> workflowApprovals = workflowApprovalRepository.findAllByProcessInstanceIdIn(processInstanceIds, of);
        List<AuthUser> users = userService.getUsers(workflowApprovals.stream().map(WorkflowApproval::getCreatedBy).collect(Collectors.toList()));
        workflowApprovals.getContent().forEach(workflowApproval -> {
            users.forEach(user -> {
                // get current node
                CamundaActivityInstance activityInstance = camundaRuntimeService.getActivityInstance(workflowApproval.getProcessInstanceId());
                // last one
                ActivityInstance[] activityInstances = activityInstance.getChildActivityInstances();
                if (activityInstances.length > 0) {
                    workflowApproval.setLatestProcessInstanceNode(activityInstances[activityInstances.length - 1].getActivityName());
                }

                if (workflowApproval.getCreatedBy().equals(user.getId())) {
                    workflowApproval.setCreatedBy(user.getUsername());
                }
            });
        });
        return workflowApprovals;
    }

    @Transactional
    @Override
    public void start(WorkflowApprovalStartDto dto) {
        // create workflow approval
        WorkflowApproval wa = new WorkflowApproval();
        wa.setTitle(dto.getTitle());
        wa.setProcessDefinitionId(dto.getProcessDefinitionId());
        workflowApprovalRepository.save(wa);

        // parse form
        FormDefDetail  formDefDetail = formDefDetailRepository.findById(dto.getFormDefDetailId()).orElse(null);
        if (null == formDefDetail) {
            throw new RuntimeException("formDefDetail not found");
        }
        Set<FormData> formDataList = new HashSet<>();
         dto.getFormData().forEach((key, value) -> {
             FormData formData = new FormData();
             formData.setKey(key);
             formData.setValue(value);
             formData.setFormDefDetailId(formDefDetail.getId());
             formData.setBusinessId(wa.getId());
             formDataList.add(formData);
         });
        formDataRepository.saveAll(formDataList);

        // start workflow
        CamundaProcessInstance processInstance = camundaRuntimeService.startProcessInstanceById(dto.getProcessDefinitionId(), wa.getId());
        wa.setProcessInstanceId(processInstance.getId());

        CamundaHistoricProcessInstance historicProcessInstance = historyService.getHistoricProcessInstanceById(processInstance.getId());
        wa.setProcessInstanceState(historicProcessInstance.getState());

        workflowApprovalRepository.save(wa);


    }

    @Transactional
    @Override
    public void process(WorkflowApproval workflowApproval, CamundaTask task, Map<String, String> variables) {
        // convert variables
        Map<String, Object> variablesMap = variables.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        CamundaHistoricProcessInstance historicProcessInstance = historyService.getHistoricProcessInstanceById(workflowApproval.getProcessInstanceId());
        workflowApproval.setProcessInstanceState(historicProcessInstance.getState());
        workflowApprovalRepository.save(workflowApproval);

        camundaTaskService.complete(task.getId(), variablesMap);
    }

}
