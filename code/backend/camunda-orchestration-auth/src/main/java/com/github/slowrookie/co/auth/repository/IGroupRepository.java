package com.github.slowrookie.co.auth.repository;

import com.github.slowrookie.co.auth.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author jiaxing.liu
 * @date 2024/5/13
 **/
public interface IGroupRepository extends JpaRepository<Group, String>{
}
