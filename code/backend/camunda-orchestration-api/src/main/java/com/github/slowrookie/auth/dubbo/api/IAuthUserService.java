package com.github.slowrookie.auth.dubbo.api;

import com.github.slowrookie.auth.dubbo.model.AuthGroup;
import com.github.slowrookie.auth.dubbo.model.AuthUser;

import java.util.List;

public interface IAuthUserService {

    List<AuthUser> getUsers(List<String> ids);

    List<AuthGroup> getGroups(String userId);

}
