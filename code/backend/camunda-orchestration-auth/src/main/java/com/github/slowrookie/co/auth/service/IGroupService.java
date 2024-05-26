package com.github.slowrookie.co.auth.service;


import com.github.slowrookie.co.auth.model.Group;
import com.github.slowrookie.co.auth.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * @author jiaxing.liu
 * @date 2024/5/13
 **/
public interface IGroupService {

    // 添加分组
    void newGroup(Group group);

    Page<Group> findAll(Pageable pageable);

    Optional<Group> getById(String id);

    void save(Group group);

    void saveWithUsers(Group group, List<User> users);

    List<Group> getGroups(List<String> ids);
}
