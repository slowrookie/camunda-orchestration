package com.github.slowrookie.co.auth.dto;

import com.github.slowrookie.co.auth.model.Group;
import com.github.slowrookie.co.auth.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class GroupWithUsers extends Group {

    private List<User> users = new ArrayList<>();

}
