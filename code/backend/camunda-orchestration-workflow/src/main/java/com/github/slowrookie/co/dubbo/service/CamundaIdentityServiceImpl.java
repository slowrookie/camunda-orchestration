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
    public Group newGroup(String groupId) {
        return identityService.newGroup(groupId);
    }

    @Override
    public void saveGroup(Group group) {
        identityService.saveGroup(group);
    }

    @Override
    public void createMembership(String userId, String groupId) {
        if (existsMembership(userId, groupId)) {
            return;
        }
        identityService.createMembership(userId, groupId);
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
