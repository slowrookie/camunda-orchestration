package com.github.slowrookie.auth.dubbo.model;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;


@Data
public class AuthGroup implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String name;

}
