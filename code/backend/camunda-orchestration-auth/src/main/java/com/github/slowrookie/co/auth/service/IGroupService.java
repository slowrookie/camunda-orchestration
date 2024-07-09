package com.github.slowrookie.co.auth.service;


import com.github.slowrookie.co.auth.model.Group;
import com.github.slowrookie.co.auth.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IGroupService {

    void groupWithUsers(Group group, List<User> users);

    Page<Group> findAll(Pageable pageable);

    Optional<Group> getById(String id);

    List<Group> getGroups(List<String> ids);

    List<Group> getGroupsByUserId(String userId);

}
