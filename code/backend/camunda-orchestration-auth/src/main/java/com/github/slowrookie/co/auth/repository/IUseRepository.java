package com.github.slowrookie.co.auth.repository;

import com.github.slowrookie.co.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author jiaxing.liu
 * @date 2024/5/11
 **/
@Repository
public interface IUseRepository extends JpaRepository<User, String> {

    User findByUsername(String username);

    boolean existsByUsername(String username);

}
