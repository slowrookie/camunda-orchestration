package com.github.slowrookie.auth.dubbo.model;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author jiaxing.liu
 * @date 2024/6/21
 **/
@Data
public class AuthUser implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String username;

}
