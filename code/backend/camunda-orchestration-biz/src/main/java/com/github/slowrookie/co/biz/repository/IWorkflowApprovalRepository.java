package com.github.slowrookie.co.biz.repository;

import com.github.slowrookie.co.biz.model.WorkflowApproval;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface IWorkflowApprovalRepository extends JpaRepository<WorkflowApproval, String> {

    Page<WorkflowApproval> findAllByProcessInstanceIdIn(Set<String> processInstanceIds, PageRequest of);

    WorkflowApproval findByProcessInstanceId(String processInstanceId);
}
