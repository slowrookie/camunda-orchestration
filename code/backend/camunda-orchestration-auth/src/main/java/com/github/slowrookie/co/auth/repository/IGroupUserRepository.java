package com.github.slowrookie.co.auth.repository;

import com.github.slowrookie.co.auth.model.GroupUser;
import com.github.slowrookie.co.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;


public interface IGroupUserRepository extends JpaRepository<GroupUser, String>{

    List<GroupUser> findGroupByUserId(String userId);

    List<GroupUser> findByGroupIdIn(List<String> list);
}
