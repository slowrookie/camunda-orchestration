package com.github.slowrookie.co.service;

import com.github.slowrookie.co.model.Group;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class GroupServiceTests {

    @Resource
    private IGroupService groupService;

    @Test
    void contextLoads() {
    }

    @Test
    public void saveGroups() {
        // 26个大写字母创建用户
        for (int i = 65; i < 91; i++) {
            Group group = new Group();
            group.setId(String.format("Group-%s", (char) i));
            group.setName(String.format("Group-%s", (char) i));
            groupService.newGroup(group);
        }
    }

}
