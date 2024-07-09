package com.github.slowrookie.co.biz.dto;

import com.github.slowrookie.co.biz.model.WorkflowApproval;
import lombok.Data;
import lombok.EqualsAndHashCode;


@EqualsAndHashCode(callSuper = true)
@Data
public class WorkflowApprovalDto extends WorkflowApproval {

    private String taskId;

}
