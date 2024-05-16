package com.github.slowrookie.co.service.impl;

import com.github.slowrookie.co.dubbo.api.ICamundaIdentityService;
import com.github.slowrookie.co.dubbo.dto.CamundaUser;
import com.github.slowrookie.co.model.User;
import com.github.slowrookie.co.repository.IUseRepository;
import com.github.slowrookie.co.service.IUserService;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author jiaxing.liu
 * @date 2024/5/10
 **/
@Service
public class UserServiceImpl implements UserDetailsService, IUserService {

    @Resource
    private IUseRepository useRepository;
    @Resource
    private PasswordEncoder passwordEncoder;
    @DubboReference
    private ICamundaIdentityService identityService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = useRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return user;
    }

    @Transactional
    @Override
    public User newUser(User user) {
        String rawPassword = user.getPassword();
        if (useRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User u = useRepository.save(user);
        CamundaUser camundaUser = new CamundaUser();
        camundaUser.setId(u.getId());
        camundaUser.setFirstName(u.getUsername());
        camundaUser.setPassword(rawPassword);
        camundaUser.setEmail(String.format("%s@email.com", u.getUsername()));
        identityService.createUser(camundaUser);
        return u;
    }

}
