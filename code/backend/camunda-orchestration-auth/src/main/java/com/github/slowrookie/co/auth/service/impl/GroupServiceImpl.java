package com.github.slowrookie.co.auth.service.impl;

import com.github.slowrookie.co.auth.model.Group;
import com.github.slowrookie.co.auth.model.GroupUser;
import com.github.slowrookie.co.auth.model.User;
import com.github.slowrookie.co.auth.repository.IGroupRepository;
import com.github.slowrookie.co.auth.repository.IGroupUserRepository;
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

@Service
public class GroupServiceImpl implements IGroupService {

    @DubboReference
    private ICamundaIdentityService camundaIdentityService;
    @Resource
    private IGroupRepository groupRepository;
    @Resource
    private IUserRepository userRepository;
    @Resource
    private IGroupUserRepository groupUserRepository;

    @Transactional
    @Override
    public void groupWithUsers(Group group, List<User> users) {
        group = groupRepository.save(group);
        // camunda group
        if(!camundaIdentityService.existsGroup(group.getId())) {
            org.camunda.bpm.engine.identity.Group camundaGroup = camundaIdentityService.newGroup(group.getId());
            camundaGroup.setId(group.getId());
            camundaGroup.setName(group.getName());
            camundaGroup.setType("WORKFLOW");
            camundaIdentityService.saveGroup(camundaGroup);
        } else {
            org.camunda.bpm.engine.identity.Group camundaGroup = camundaIdentityService.newGroup(group.getId());
            camundaGroup.setName(group.getName());
            camundaGroup.setType("WORKFLOW");
            camundaIdentityService.modifyGroup(camundaGroup);
        }
        // membership
        if (CollectionUtils.isEmpty(users)) {
            groupUserRepository.deleteByGroupId(group.getId());
            return;
        }
        String groupId = group.getId();
        List<User> removeUsers = groupUserRepository.findByGroupId(group.getId())
                .stream()
                .map(GroupUser::getUser)
                .filter(user -> !users.contains(user))
                .toList();
        if (!CollectionUtils.isEmpty(removeUsers)) {
            groupUserRepository.deleteByGroupIdAndUserIdIn(group.getId(), removeUsers.stream().map(User::getId).toList());
            removeUsers.forEach(user -> camundaIdentityService.deleteMembership(user.getId(), groupId));
        }

        List<GroupUser> groupUsers = users.stream()
                .map(user -> new GroupUser(groupId, user.getId()))
                .toList();
        groupUserRepository.saveAll(groupUsers);
        groupUsers.forEach(groupUser -> camundaIdentityService.createMembership(groupUser.getUser().getId(), groupId));
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
    public List<Group> getGroups(List<String> ids) {
        return groupRepository.findAllById(ids);
    }

    @Override
    public List<Group> getGroupsByUserId(String userId) {
        return groupUserRepository.findGroupByUserId(userId).stream()
                .map(GroupUser::getGroup)
                .toList();
    }

    @Override
    public List<GroupUser> getUsersByGroups(List<String> list) {
        return groupUserRepository.findByGroupIdIn(list).stream().toList();
    }
}
