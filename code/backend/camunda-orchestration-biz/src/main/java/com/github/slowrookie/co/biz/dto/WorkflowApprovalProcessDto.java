package com.github.slowrookie.co.biz.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class WorkflowApprovalProcessDto {

    @NotEmpty
    @NotNull
    private String id;

    @NotNull
    @NotEmpty
    private String processDefinitionId;

    @NotNull
    @NotEmpty
    private String processInstanceId;

    @NotNull
    @NotEmpty
    private String taskId;

    private Map<String, String> variables = new HashMap<>();

}
