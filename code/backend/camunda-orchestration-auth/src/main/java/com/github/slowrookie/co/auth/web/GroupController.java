package com.github.slowrookie.co.auth.web;

import com.github.slowrookie.co.auth.dto.GroupCreateDto;
import com.github.slowrookie.co.auth.dto.GroupModifyDto;
import com.github.slowrookie.co.auth.model.Group;
import com.github.slowrookie.co.auth.model.User;
import com.github.slowrookie.co.auth.service.IGroupService;
import com.github.slowrookie.co.auth.service.IUserService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
public class GroupController {

    @Resource
    private IGroupService groupService;
    @Resource
    private IUserService userService;

    @GetMapping("/groups")
    private Page<Group> queryUsersByPage(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return groupService.findAll(PageRequest.of(page, size));
    }

    @PutMapping("/group")
    private ResponseEntity<Object> create(@RequestBody @Valid GroupCreateDto dto) {
        Group group = new Group();
        group.setName(dto.getName());
        if (!CollectionUtils.isEmpty(dto.getUsers())) {
            List<User> users = userService.findAllById(dto.getUsers().stream().map(User::getId).toList());
            group.setUsers(users);
        }
        groupService.newGroup(group);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/group")
    private ResponseEntity<Object> modify(@RequestBody @Valid GroupModifyDto dto) {
        Optional<Group> go = groupService.getById(dto.getId());
        if (go.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Group group = go.get();
        groupService.saveWithUsers(group, dto.getUsers());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/groups/ids")
    private ResponseEntity<List<Group>> queryGroupsByIds(@RequestBody List<String> ids) {
        return ResponseEntity.ok(groupService.getGroups(ids));
    }

}
