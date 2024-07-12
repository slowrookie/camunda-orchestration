package com.github.slowrookie.co.auth.dubbo.service;

import com.github.slowrookie.auth.dubbo.api.IAuthUserService;
import com.github.slowrookie.auth.dubbo.model.AuthGroup;
import com.github.slowrookie.auth.dubbo.model.AuthUser;
import com.github.slowrookie.co.auth.service.IGroupService;
import com.github.slowrookie.co.auth.service.IUserService;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;

import java.util.List;
import java.util.stream.Collectors;

@DubboService
public class IAuthUserServiceImpl implements IAuthUserService {

    @Resource
    private IUserService userService;
    @Resource
    private IGroupService groupService;

    @Override
    public List<AuthUser> getUsers(List<String> ids) {
        return userService.getUsers(ids).stream().map(user -> {
            AuthUser authUser = new AuthUser();
            authUser.setId(user.getId());
            authUser.setUsername(user.getUsername());
            return authUser;
        }).collect(Collectors.toList());
    }

    @Override
    public List<AuthGroup> getGroups(String userId) {
        return groupService.getGroupsByUserId(userId).stream().map(group -> {
            AuthGroup authGroup = new AuthGroup();
            authGroup.setId(group.getId());
            authGroup.setName(group.getName());
            return authGroup;
        }).collect(Collectors.toList());
    }

}
