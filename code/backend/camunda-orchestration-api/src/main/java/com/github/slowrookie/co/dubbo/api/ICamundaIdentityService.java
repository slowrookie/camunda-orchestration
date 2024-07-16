package com.github.slowrookie.co.dubbo.api;

import org.camunda.bpm.engine.identity.Group;
import org.camunda.bpm.engine.identity.User;

public interface ICamundaIdentityService {

    User newUser(String userId);

    void saveUser(User user);

    void modifyUser(User user);

    Group newGroup(String groupId);

    void saveGroup(Group group);

    void modifyGroup(Group group);

    void createMembership(String userId, String groupId);

    void deleteMembership(String userId, String groupId);

    boolean existsGroup(String groupId);

    boolean existsUsers(String userId);

    boolean existsMembership(String userId, String groupId);

}
