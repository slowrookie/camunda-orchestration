package com.github.slowrookie.co.biz.camunda.external.task;

import com.github.slowrookie.co.biz.model.WorkflowApproval;
import com.github.slowrookie.co.biz.repository.IWorkflowApprovalRepository;
import com.github.slowrookie.co.dubbo.api.ICamundaHistoryService;
import com.github.slowrookie.co.dubbo.model.CamundaHistoricProcessInstance;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.apache.dubbo.config.annotation.DubboReference;
import org.camunda.bpm.client.spring.annotation.ExternalTaskSubscription;
import org.camunda.bpm.client.task.ExternalTask;
import org.camunda.bpm.client.task.ExternalTaskHandler;
import org.camunda.bpm.client.task.ExternalTaskService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@ExternalTaskSubscription("amount-invoke")
public class AmountInvokeHandler implements ExternalTaskHandler {

    @DubboReference
    private ICamundaHistoryService historyService;
    @Resource
    private IWorkflowApprovalRepository workflowApprovalRepository;

    @Transactional
    @Override
    public void execute(ExternalTask externalTask, ExternalTaskService externalTaskService) {
        log.info("AmountInvokeHandler execute {}", externalTask.getId());
        externalTaskService.complete(externalTask);

        // update state
        WorkflowApproval wa = workflowApprovalRepository.findByProcessInstanceId(externalTask.getProcessInstanceId());
        CamundaHistoricProcessInstance historicProcessInstance = historyService.getHistoricProcessInstanceById(externalTask.getProcessInstanceId());
        wa.setProcessInstanceState(historicProcessInstance.getState());
        workflowApprovalRepository.save(wa);
    }

}
