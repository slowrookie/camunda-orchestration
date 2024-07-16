package com.github.slowrookie.co.auth.repository;

import com.github.slowrookie.co.auth.model.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface IGroupUserRepository extends JpaRepository<GroupUser, String>{

    List<GroupUser> findGroupByUserId(String userId);

    List<GroupUser> findByGroupId(String groupId);

    List<GroupUser> findByGroupIdIn(List<String> list);

    void deleteByGroupId(String id);

    void deleteByGroupIdAndUserIdIn(String id, List<String> list);
}
