package com.github.slowrookie.co.auth.dto;

import com.github.slowrookie.co.auth.model.User;
import jakarta.validation.constraints.NotNull;
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

    private List<User> users = new ArrayList<>();

}
