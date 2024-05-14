package com.github.slowrookie.co.dubbo.service;

import com.github.slowrookie.co.dubbo.api.ICamundaIdentityService;
import com.github.slowrookie.co.dubbo.dto.CamundaGroup;
import com.github.slowrookie.co.dubbo.dto.CamundaUser;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.identity.Group;
import org.camunda.bpm.engine.identity.User;
import org.springframework.beans.BeanUtils;

/**
 * @author jiaxing.liu
 * @date 2024/5/10
 **/
@DubboService
public class CamundaIdentityServiceImpl implements ICamundaIdentityService {

    @Resource
    private IdentityService identityService;

    @Override
    public void createUser(CamundaUser camundaUser) {
        User user = identityService.newUser(camundaUser.getId());
        BeanUtils.copyProperties(camundaUser, user);
        identityService.saveUser(user);
    }

    @Override
    public CamundaUser getUser(String userId) {
        User user = identityService.createUserQuery().userId(userId).singleResult();
        CamundaUser camundaUser = new CamundaUser();
        BeanUtils.copyProperties(user, camundaUser);
        return camundaUser;
    }

    @Override
    public void createGroup(CamundaGroup camundaGroup) {
        Group group = identityService.newGroup(camundaGroup.getId());
        group.setName(camundaGroup.getName());
        group.setType("WORKFLOW");
        identityService.saveGroup(group);
    }

}
