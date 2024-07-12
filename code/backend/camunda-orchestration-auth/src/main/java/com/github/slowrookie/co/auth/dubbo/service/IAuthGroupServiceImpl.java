package com.github.slowrookie.co.auth.dubbo.service;

import com.github.slowrookie.auth.dubbo.api.IAuthGroupService;
import com.github.slowrookie.auth.dubbo.model.AuthGroup;
import com.github.slowrookie.co.auth.service.IGroupService;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;

import java.util.List;
import java.util.stream.Collectors;

@DubboService
public class IAuthGroupServiceImpl implements IAuthGroupService {

    @Resource
    private IGroupService groupService;

    @Override
    public List<AuthGroup> getGroups(List<String> groupIds) {
        return groupService.getGroups(groupIds).stream().map(group -> {
            AuthGroup authGroup = new AuthGroup();
            authGroup.setId(group.getId());
            authGroup.setName(group.getName());
            return authGroup;
        }).collect(Collectors.toList());
    }

}
