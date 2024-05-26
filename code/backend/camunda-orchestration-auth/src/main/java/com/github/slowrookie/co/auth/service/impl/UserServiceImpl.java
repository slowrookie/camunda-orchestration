package com.github.slowrookie.co.auth.service.impl;

import com.github.slowrookie.co.auth.model.CoUserDetail;
import com.github.slowrookie.co.auth.model.User;
import com.github.slowrookie.co.auth.repository.IUserRepository;
import com.github.slowrookie.co.auth.service.IUserService;
import com.github.slowrookie.co.dubbo.api.ICamundaIdentityService;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * @author jiaxing.liu
 * @date 2024/5/10
 **/
@Service
public class UserServiceImpl implements UserDetailsService, IUserService {

    @Resource
    private IUserRepository useRepository;
    @Resource
    private PasswordEncoder passwordEncoder;
    @DubboReference
    private ICamundaIdentityService camundaIdentityService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = useRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return CoUserDetail.fromUser(user);
    }

    @Override
    public boolean existsByUsername(String username) {
        return useRepository.existsByUsername(username);
    }

    @Override
    public Page<User> findAll(Pageable pageable) {
        return useRepository.findAll(pageable);
    }

    @Override
    public Optional<User> getUser(String id) {
        return useRepository.findById(id);
    }

    @Transactional
    @Override
    public User newUser(User user) {
        String rawPassword = user.getPassword();
        if (existsByUsername(user.getUsername())) {
            throw new RuntimeException("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User u = useRepository.save(user);
        org.camunda.bpm.engine.identity.User camundaUser = camundaIdentityService.newUser(u.getId());
        camundaUser.setId(u.getId());
        camundaUser.setFirstName(u.getUsername());
        camundaUser.setPassword(rawPassword);
        camundaUser.setEmail(String.format("%s@email.com", u.getUsername()));
        camundaIdentityService.saveUser(camundaUser);
        return u;
    }

    @Override
    public List<User> findAllById(List<String> list) {
        return useRepository.findAllById(list);
    }

    @Override
    public List<User> getUsers(List<String> ids) {
        return useRepository.findAllById(ids);
    }

}
