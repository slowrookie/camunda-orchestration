package com.github.slowrookie.co.auth.web;

import com.github.slowrookie.co.auth.dto.GroupCreateDto;
import com.github.slowrookie.co.auth.dto.GroupModifyDto;
import com.github.slowrookie.co.auth.dto.GroupWithUsers;
import com.github.slowrookie.co.auth.model.Group;
import com.github.slowrookie.co.auth.model.GroupUser;
import com.github.slowrookie.co.auth.service.IGroupService;
import com.github.slowrookie.co.auth.service.IUserService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
public class GroupController {

    @Resource
    private IGroupService groupService;
    @Resource
    private IUserService userService;

    @GetMapping("/groups")
    private Page<GroupWithUsers> queryUsersByPage(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<Group> groups = groupService.findAll(PageRequest.of(page, size));
        List<GroupUser> gu = groupService.getUsersByGroups(groups.getContent().stream().map(Group::getId).toList());
        return groups.map(group -> {
            GroupWithUsers groupWithUsers = new GroupWithUsers();
            groupWithUsers.setUsers(gu.stream().filter(g -> g.getGroup().getId().equals(group.getId())).map(GroupUser::getUser).toList());
            groupWithUsers.setId(group.getId());
            groupWithUsers.setName(group.getName());
            return groupWithUsers;
        });
    }

    @PutMapping("/group")
    private ResponseEntity<Object> create(@RequestBody @Valid GroupCreateDto dto) {
        Group group = new Group();
        group.setName(dto.getName());
        groupService.groupWithUsers(group, dto.getUsers());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/group")
    private ResponseEntity<Object> modify(@RequestBody @Valid GroupModifyDto dto) {
        Optional<Group> go = groupService.getById(dto.getId());
        if (go.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Group group = go.get();
        groupService.groupWithUsers(group, dto.getUsers());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/groups/ids")
    private List<GroupWithUsers> queryGroupsByIds(@RequestBody List<String> ids) {
        List<Group> groups = groupService.getGroups(ids);
        List<GroupUser> gu = groupService.getUsersByGroups(groups.stream().map(Group::getId).toList());
        return groups.stream().map(group -> {
            GroupWithUsers groupWithUsers = new GroupWithUsers();
            groupWithUsers.setUsers(gu.stream().filter(g -> g.getGroup().getId().equals(group.getId())).map(GroupUser::getUser).toList());
            groupWithUsers.setId(group.getId());
            groupWithUsers.setName(group.getName());
            return groupWithUsers;
        }).collect(Collectors.toList());
    }

}
