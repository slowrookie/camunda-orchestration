package com.github.slowrookie.co.auth.dubbo.service;

import com.github.slowrookie.auth.dubbo.api.IAuthUserService;
import com.github.slowrookie.auth.dubbo.model.AuthUser;
import com.github.slowrookie.co.auth.service.IUserService;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author jiaxing.liu
 * @date 2024/6/21
 **/
@DubboService
public class IAuthUserServiceImpl implements IAuthUserService {

    @Resource
    private IUserService userService;

    @Override
    public List<AuthUser> getUsers(List<String> ids) {
        return userService.getUsers(ids).stream().map(user -> {
            AuthUser authUser = new AuthUser();
            authUser.setId(user.getId());
            authUser.setUsername(user.getUsername());
            return authUser;
        }).collect(Collectors.toList());
    }
}
