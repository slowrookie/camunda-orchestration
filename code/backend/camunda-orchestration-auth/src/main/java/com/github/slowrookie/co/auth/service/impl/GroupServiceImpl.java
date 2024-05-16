package com.github.slowrookie.co.auth.service.impl;

import com.github.slowrookie.co.auth.model.Group;
import com.github.slowrookie.co.auth.service.IGroupService;
import com.github.slowrookie.co.dubbo.api.ICamundaIdentityService;
import com.github.slowrookie.co.dubbo.dto.CamundaGroup;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.stereotype.Service;

/**
 * @author jiaxing.liu
 * @date 2024/5/13
 **/
@Service
public class GroupServiceImpl implements IGroupService {

    @DubboReference
    private ICamundaIdentityService camundaIdentityService;

    @Override
    public void newGroup(Group group) {
        CamundaGroup camundaGroup = new CamundaGroup();
        camundaGroup.setId(group.getId());
        camundaGroup.setName(group.getName());
        camundaIdentityService.createGroup(camundaGroup);
    }

}
