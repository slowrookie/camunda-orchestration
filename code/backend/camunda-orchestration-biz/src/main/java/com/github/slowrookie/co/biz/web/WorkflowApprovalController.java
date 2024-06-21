package com.github.slowrookie.co.biz.web;

import com.github.slowrookie.co.biz.dto.WorkflowApprovalStartDto;
import com.github.slowrookie.co.biz.model.WorkflowApproval;
import com.github.slowrookie.co.biz.service.IWorkflowApprovalService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

/**
 * @author jiaxing.liu
 **/
@RestController
public class WorkflowApprovalController {

    @Resource
    private IWorkflowApprovalService workflowApprovalService;

    @GetMapping("/workflow-approval")
    public Page<WorkflowApproval> pages(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return workflowApprovalService.findAll(PageRequest.of(page, size));
    }

    @PostMapping("/workflow-approval/start")
    public void start(@RequestBody @Valid WorkflowApprovalStartDto dto) {
        workflowApprovalService.start(dto);
    }



}
