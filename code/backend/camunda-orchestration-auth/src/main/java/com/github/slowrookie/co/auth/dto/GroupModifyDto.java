package com.github.slowrookie.co.auth.dto;

import com.github.slowrookie.co.auth.model.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @author jiaxing.liu
 * @date 2024/5/17
 **/
@Data
public class GroupModifyDto {

    @NotNull
    private String id;

    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9\\u4e00-\\u9fa5]{2,16}$")
    private String name;

    private List<User> users = new ArrayList<>();

}
