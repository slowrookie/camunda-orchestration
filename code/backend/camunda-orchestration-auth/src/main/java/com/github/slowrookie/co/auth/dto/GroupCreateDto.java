package com.github.slowrookie.co.auth.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @author jiaxing.liu
 * @date 2024/5/17
 **/
@Data
public class GroupCreateDto {

    @NotNull
    private String name;

}
