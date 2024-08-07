package com.github.slowrookie.co.auth.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * @author jiaxing.liu
 * @date 2024/5/17
 **/
@Data
public class UserCreateDto {

    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9]{4,16}$")
    private String username;

    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9]{6,16}$")
    private String password;

}
