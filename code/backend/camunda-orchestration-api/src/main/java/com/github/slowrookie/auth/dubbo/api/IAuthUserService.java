package com.github.slowrookie.auth.dubbo.api;

import com.github.slowrookie.auth.dubbo.model.AuthUser;

import java.util.List;

/**
 * @author jiaxing.liu
 * @date 2024/6/21
 **/
public interface IAuthUserService {

    List<AuthUser> getUsers(List<String> ids);

}
