package com.github.slowrookie.co.biz.repository;

import com.github.slowrookie.co.biz.model.WorkflowApproval;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IWorkflowApprovalRepository extends JpaRepository<WorkflowApproval, String> {

    Page<WorkflowApproval> findAllByProcessInstanceIdIn(List<String> processInstanceIds, PageRequest of);

}
