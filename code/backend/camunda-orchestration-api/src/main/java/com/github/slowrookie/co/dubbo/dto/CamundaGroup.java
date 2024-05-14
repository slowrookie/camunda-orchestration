package com.github.slowrookie.co.dubbo.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author jiaxing.liu
 * @date 2024/5/10
 **/
@Data
public class CamundaGroup implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String name;

}
