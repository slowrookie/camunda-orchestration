package com.github.slowrookie.co.biz.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FormDefDetailCreate {

    @NotNull
    @NotEmpty
    private String name;

    @NotNull
    @NotEmpty
    private String key;

    @NotNull
    @NotEmpty
    private String schemas;

    @NotNull
    private Boolean enable;

    private String formDefId;

}
