package com.github.slowrookie.co.biz.web;

import com.github.slowrookie.auth.dubbo.api.IAuthUserService;
import com.github.slowrookie.auth.dubbo.model.AuthGroup;
import com.github.slowrookie.co.biz.dto.WorkflowApprovalDto;
import com.github.slowrookie.co.biz.dto.WorkflowApprovalProcessDto;
import com.github.slowrookie.co.biz.dto.WorkflowApprovalStartDto;
import com.github.slowrookie.co.biz.model.WorkflowApproval;
import com.github.slowrookie.co.biz.service.IWorkflowApprovalService;
import com.github.slowrookie.co.dubbo.api.ICamundaTaskService;
import com.github.slowrookie.co.dubbo.model.CamundaTask;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class WorkflowApprovalController {

    @DubboReference
    private IAuthUserService userService;

    @Resource
    private IWorkflowApprovalService workflowApprovalService;
    @DubboReference
    private ICamundaTaskService camundaTaskService;

    @GetMapping("/workflow-approval")
    public Page<WorkflowApproval> pages(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return workflowApprovalService.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/workflow-approval/pending")
    public Page<WorkflowApprovalDto> pendingPages(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size, Authentication auth) {
        String userId = auth.getName();
        List<String> groupIds = userService.getGroups(userId).stream().map(AuthGroup::getId).toList();
        List<CamundaTask> tasks = camundaTaskService.getTaskByUserIdOrGroups(userId, groupIds);
        List<String> processInstanceIds = tasks.stream().map(CamundaTask::getProcessInstanceId).toList();

        Page<WorkflowApproval> workflowApprovals = workflowApprovalService.findAllPending(userId,
                processInstanceIds,
                PageRequest.of(page, size));

        return workflowApprovals.map(wa -> {
            WorkflowApprovalDto dto = new WorkflowApprovalDto();
            BeanUtils.copyProperties(wa, dto);
            tasks.stream().filter(t -> t.getProcessInstanceId().equals(wa.getProcessInstanceId())).findFirst().ifPresent(t -> {
                dto.setTaskId(t.getId());
            });
            return dto;
        });
    }

    @PostMapping("/workflow-approval/start")
    public void start(@RequestBody @Valid WorkflowApprovalStartDto dto) {
        workflowApprovalService.start(dto);
    }

    @PostMapping("/workflow-approval/process")
    public void process(@RequestBody @Valid WorkflowApprovalProcessDto dto) {
        CamundaTask task = camundaTaskService.getTaskById(dto.getTaskId());
        if (task == null) {
            throw new RuntimeException("task not found");
        }

        WorkflowApproval workflowApproval = workflowApprovalService.getById(dto.getId());
        if (null == workflowApproval) {
            throw new RuntimeException("workflow approval not found");
        }

        workflowApprovalService.process(workflowApproval, task, dto.getVariables());
    }



}
