package com.github.slowrookie.co.auth.repository;

import com.github.slowrookie.co.auth.model.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface IGroupUserRepository extends JpaRepository<GroupUser, String>{

    List<GroupUser> findGroupByUserId(String userId);

}
