package com.github.slowrookie.co.auth.web;

import com.github.slowrookie.co.auth.dto.GroupCreateDto;
import com.github.slowrookie.co.auth.dto.GroupModifyDto;
import com.github.slowrookie.co.auth.model.Group;
import com.github.slowrookie.co.auth.service.IGroupService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
public class GroupController {

    @Resource
    private IGroupService groupService;

    @GetMapping("/groups")
    private Page<Group> queryUsersByPage(Pageable pageable) {
        return groupService.findAll(pageable);
    }

    @PutMapping("/group")
    private ResponseEntity<Object> create(@RequestBody @Valid GroupCreateDto groupCreateDto) {
        Group group = new Group();
        group.setName(groupCreateDto.getName());
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
        group.setUsers(dto.getUsers());
        groupService.save(group);
        return ResponseEntity.noContent().build();
    }

}
