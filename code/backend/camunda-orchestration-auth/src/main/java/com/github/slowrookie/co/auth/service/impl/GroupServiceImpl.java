package com.github.slowrookie.co.auth.service.impl;

import com.github.slowrookie.co.auth.model.Group;
import com.github.slowrookie.co.auth.model.User;
import com.github.slowrookie.co.auth.repository.IGroupRepository;
import com.github.slowrookie.co.auth.repository.IUserRepository;
import com.github.slowrookie.co.auth.service.IGroupService;
import com.github.slowrookie.co.dubbo.api.ICamundaIdentityService;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Optional;

/**
 * @author jiaxing.liu
 * @date 2024/5/13
 **/
@Service
public class GroupServiceImpl implements IGroupService {

    @DubboReference
    private ICamundaIdentityService camundaIdentityService;
    @Resource
    private IGroupRepository groupRepository;
    @Resource
    private IUserRepository userRepository;


    @Transactional
    @Override
    public void newGroup(Group group) {
        group = groupRepository.save(group);
        org.camunda.bpm.engine.identity.Group camundaGroup = camundaIdentityService.newGroup(group.getId());
        camundaGroup.setId(group.getId());
        camundaGroup.setName(group.getName());
        camundaGroup.setType("WORKFLOW");
        camundaIdentityService.saveGroup(camundaGroup);
        // membership
        if (CollectionUtils.isEmpty(group.getUsers())) {
            return;
        }
        Group finalGroup = group;
        group.getUsers().forEach(user -> camundaIdentityService.createMembership(user.getId(), finalGroup.getId()));

    }

    @Override
    public Page<Group> findAll(Pageable pageable) {
        return groupRepository.findAll(pageable);
    }

    @Override
    public Optional<Group> getById(String id) {
        return groupRepository.findById(id);
    }

    @Override
    public void save(Group group) {
        groupRepository.save(group);
    }

    @Transactional
    @Override
    public void saveWithUsers(Group group, List<User> users) {
        // delete membership
        if (!CollectionUtils.isEmpty(group.getUsers())) {
            group.getUsers().forEach(user -> camundaIdentityService.deleteMembership(user.getId(), group.getId()));
        }
        if (!CollectionUtils.isEmpty(users)) {
            users = userRepository.findAllById(users.stream().map(User::getId).toList());
            group.setUsers(users);
            // create membership
            users.forEach(user -> camundaIdentityService.createMembership(user.getId(), group.getId()));
        }
        groupRepository.save(group);
    }

    @Override
    public List<Group> getGroups(List<String> ids) {
        return groupRepository.findAllById(ids);
    }
}
