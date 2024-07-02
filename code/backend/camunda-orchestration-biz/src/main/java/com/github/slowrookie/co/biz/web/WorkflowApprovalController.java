package com.github.slowrookie.co.biz.web;

import com.github.slowrookie.auth.dubbo.api.IAuthUserService;
import com.github.slowrookie.auth.dubbo.model.AuthGroup;
import com.github.slowrookie.co.biz.dto.WorkflowApprovalStartDto;
import com.github.slowrookie.co.biz.model.WorkflowApproval;
import com.github.slowrookie.co.biz.service.IWorkflowApprovalService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.apache.dubbo.config.annotation.DubboReference;
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

    @GetMapping("/workflow-approval")
    public Page<WorkflowApproval> pages(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return workflowApprovalService.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/workflow-approval/pending")
    public Page<WorkflowApproval> pendingPages(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int size, Authentication auth) {
        String userId = auth.getName();
        return workflowApprovalService.findAllPending(userId, PageRequest.of(page, size));
    }

    @PostMapping("/workflow-approval/start")
    public void start(@RequestBody @Valid WorkflowApprovalStartDto dto) {
        workflowApprovalService.start(dto);
    }



}
