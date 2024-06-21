package com.github.slowrookie.co.biz.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

/**
 * @author jiaxing.liu
 * @date 2024/6/21
 **/
@Data
public class WorkflowApprovalStartDto {

    @NotNull
    private String title;

    @NotNull
    private String formDefDetailId;

    @NotNull
    private Map<String, String> formData;

    @NotNull
    private String processDefinitionId;


}
