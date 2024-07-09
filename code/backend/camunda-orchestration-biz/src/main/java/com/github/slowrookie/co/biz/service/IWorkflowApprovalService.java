package com.github.slowrookie.co.biz.service;

import com.github.slowrookie.co.biz.dto.WorkflowApprovalStartDto;
import com.github.slowrookie.co.biz.model.WorkflowApproval;
import com.github.slowrookie.co.dubbo.model.CamundaTask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;

public interface IWorkflowApprovalService {

    Page<WorkflowApproval> findAll(PageRequest of);

    Page<WorkflowApproval> findAllPending(String userId, List<String> processInstanceIds, PageRequest of);

    void start(WorkflowApprovalStartDto dto);

    void process(WorkflowApproval workflowApproval, CamundaTask task, Map<String, String> variables);

    WorkflowApproval getById(String id);

}
