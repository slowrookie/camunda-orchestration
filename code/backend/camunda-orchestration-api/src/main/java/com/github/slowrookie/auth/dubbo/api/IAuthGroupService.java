package com.github.slowrookie.auth.dubbo.api;


import com.github.slowrookie.auth.dubbo.model.AuthGroup;

import java.util.List;

public interface IAuthGroupService {

    List<AuthGroup> getGroups(List<String> groupIds);

}
