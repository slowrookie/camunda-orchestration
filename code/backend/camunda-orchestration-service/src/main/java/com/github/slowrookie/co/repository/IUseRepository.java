package com.github.slowrookie.co.repository;

import com.github.slowrookie.co.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author jiaxing.liu
 * @date 2024/5/11
 **/
@Repository
public interface IUseRepository extends JpaRepository<User, String> {

    public User findByUsername(String username);

}
