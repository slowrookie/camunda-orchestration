package com.github.slowrookie.co.auth.service.impl;

import com.github.slowrookie.co.auth.model.Group;
import com.github.slowrookie.co.auth.model.User;
import com.github.slowrookie.co.auth.repository.IGroupRepository;
import com.github.slowrookie.co.auth.service.IGroupService;
import com.github.slowrookie.co.dubbo.api.ICamundaIdentityService;
import com.github.slowrookie.co.dubbo.dto.CamundaGroup;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

    @Override
    public void newGroup(Group group) {
        CamundaGroup camundaGroup = new CamundaGroup();
        camundaGroup.setId(group.getId());
        camundaGroup.setName(group.getName());
        groupRepository.save(group);
        camundaIdentityService.createGroup(camundaGroup);
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

}
