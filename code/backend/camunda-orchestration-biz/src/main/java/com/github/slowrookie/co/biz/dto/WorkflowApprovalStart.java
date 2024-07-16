package com.github.slowrookie.co.biz.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class WorkflowApprovalStart {

    @NotNull
    private String title;

    @NotNull
    private String formDefDetailId;

    @NotNull
    private Map<String, String> formData;

    @NotNull
    private String processDefinitionId;


}
