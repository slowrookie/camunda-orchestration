package com.github.slowrookie.co.auth.dto;

import com.github.slowrookie.co.auth.model.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * @author jiaxing.liu
 * @date 2024/5/17
 **/
@Data
public class GroupCreateDto {

    @NotNull
    private String name;

    private List<User> users;
}
