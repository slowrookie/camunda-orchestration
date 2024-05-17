package com.github.slowrookie.co.auth.service;

import com.github.slowrookie.co.auth.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * @author jiaxing.liu
 * @date 2024/5/11
 **/
public interface IUserService {

    Page<User> findAll(Pageable pageable);

    boolean existsByUsername(String username);

    Optional<User> getUser(String id);

    // 添加用户
    User newUser(User user);

}
