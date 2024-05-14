package com.github.slowrookie.co.dubbo.api;

import com.github.slowrookie.co.dubbo.dto.CamundaGroup;
import com.github.slowrookie.co.dubbo.dto.CamundaUser;

/**
 * @author jiaxing.liu
 * @date 2024/5/10
 **/
public interface ICamundaIdentityService {

    void createUser(CamundaUser camundaUser);

    CamundaUser getUser(String userId);

    public void createGroup(CamundaGroup camundaGroup);

}
