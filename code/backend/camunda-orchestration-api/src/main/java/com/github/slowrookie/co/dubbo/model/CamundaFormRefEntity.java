package com.github.slowrookie.co.dubbo.model;


import lombok.Data;
import org.camunda.bpm.engine.form.CamundaFormRef;

import java.io.Serial;
import java.io.Serializable;

@Data
public class CamundaFormRefEntity implements CamundaFormRef, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String key;

    private String binding;

    private Integer version;

}
