package com.github.slowrookie.co.biz.repository;

import com.github.slowrookie.co.biz.model.WorkflowApproval;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IWorkflowApprovalRepository extends JpaRepository<WorkflowApproval, String> {

}
