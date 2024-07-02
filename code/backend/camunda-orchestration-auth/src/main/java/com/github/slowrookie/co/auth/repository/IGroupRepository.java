package com.github.slowrookie.co.auth.repository;

import com.github.slowrookie.co.auth.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface IGroupRepository extends JpaRepository<Group, String>{

    List<Group> findByUsersId(String userId);

}
