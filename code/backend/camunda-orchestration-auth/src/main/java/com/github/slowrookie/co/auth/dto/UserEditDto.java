package com.github.slowrookie.co.auth.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;


@Data
public class UserEditDto {

    @NotNull
    private String id;

    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9]{4,16}$")
    private String username;

    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9]{6,16}$")
    private String password;

}
