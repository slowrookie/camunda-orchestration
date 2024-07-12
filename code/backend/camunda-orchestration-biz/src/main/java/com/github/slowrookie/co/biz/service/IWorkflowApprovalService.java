package com.github.slowrookie.co.biz.service;

import com.github.slowrookie.co.biz.dto.WorkflowApprovalStartDto;
import com.github.slowrookie.co.biz.model.WorkflowApproval;
import com.github.slowrookie.co.dubbo.model.CamundaTask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface IWorkflowApprovalService {

    Page<WorkflowApproval> findAll(PageRequest of);

    Page<WorkflowApproval> findAllPending(String userId, Set<String> processInstanceIds, PageRequest of);

    void start(WorkflowApprovalStartDto dto);

    void process(String userId, WorkflowApproval workflowApproval, CamundaTask task, Map<String, String> variables);

    WorkflowApproval getById(String id);

}
