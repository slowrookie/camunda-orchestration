package com.github.slowrookie.co.dubbo.service;

import com.github.slowrookie.co.dubbo.api.ICamundaIdentityService;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.identity.Group;
import org.camunda.bpm.engine.identity.User;


@DubboService
public class CamundaIdentityServiceImpl implements ICamundaIdentityService {

    @Resource
    private IdentityService identityService;

    @Override
    public User newUser(String userId) {
        return identityService.newUser(userId);
    }

    @Override
    public void saveUser(User user) {
        identityService.saveUser(user);
    }

    @Override
    public void modifyUser(User user) {
        User exists = identityService.createUserQuery().userId(user.getId()).singleResult();
        if (exists != null) {
            exists.setFirstName(user.getFirstName());
            exists.setLastName(user.getPassword());
            identityService.saveUser(exists);
        }
    }

    @Override
    public Group newGroup(String groupId) {
        return identityService.newGroup(groupId);
    }

    @Override
    public void saveGroup(Group group) {
        identityService.saveGroup(group);
    }

    @Override
    public void modifyGroup(Group group) {
        Group exists = identityService.createGroupQuery().groupId(group.getId()).singleResult();
        if (exists != null) {
            exists.setName(group.getName());
            exists.setType(group.getType());
            identityService.saveGroup(exists);
        }
    }

    @Override
    public void createMembership(String userId, String groupId) {
        if (existsMembership(userId, groupId)) {
            return;
        }
        identityService.createMembership(userId, groupId);
    }

    @Override
    public void deleteMembership(String userId, String groupId) {
        if (existsMembership(userId, groupId)) {
            identityService.deleteMembership(userId, groupId);
        }
    }

    @Override
    public boolean existsGroup(String groupId) {
         return identityService.createGroupQuery().groupId(groupId).count() > 0;
    }

    @Override
    public boolean existsUsers(String userId) {
        return identityService.createUserQuery().userId(userId).count() > 0;
    }

    @Override
    public boolean existsMembership(String userId, String groupId) {
        return identityService.createGroupQuery().groupMember(userId).groupId(groupId).count() > 0;
    }
}
