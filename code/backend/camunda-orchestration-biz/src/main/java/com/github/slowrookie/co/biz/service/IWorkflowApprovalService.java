package com.github.slowrookie.co.biz.service;

import com.github.slowrookie.co.biz.dto.WorkflowApprovalStartDto;
import com.github.slowrookie.co.biz.model.WorkflowApproval;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface IWorkflowApprovalService {

    Page<WorkflowApproval> findAll(PageRequest of);

    void start(WorkflowApprovalStartDto dto);
}
