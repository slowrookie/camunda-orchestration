package com.github.slowrookie.co.biz.dto;

import com.github.slowrookie.co.biz.model.FormData;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class WorkflowApprovalProcess {

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

    private List<FormDefDetailWithData> formData = new ArrayList<>();

    private List<FormDefDetailWithData> newFormData = new ArrayList<>();

}
