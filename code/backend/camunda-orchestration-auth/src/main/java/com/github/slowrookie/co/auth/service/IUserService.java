package com.github.slowrookie.co.auth.service;

import com.github.slowrookie.co.auth.model.User;

import java.util.Optional;

/**
 * @author jiaxing.liu
 * @date 2024/5/11
 **/
public interface IUserService {


    Optional<User> getUser(String id);

    // 添加用户
    User newUser(User user);

}
