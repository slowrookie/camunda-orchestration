package com.github.slowrookie.co.dubbo.service;


import com.github.slowrookie.co.dubbo.api.ICamundaTaskService;
import com.github.slowrookie.co.dubbo.model.CamundaTask;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.engine.task.TaskQuery;
import org.springframework.beans.BeanUtils;
import org.springframework.util.CollectionUtils;

import java.util.List;

@DubboService
public class CamundaTaskServiceImpl implements ICamundaTaskService {

    @Resource
    private TaskService taskService;

    @Override
    public List<CamundaTask> getTaskByUserIdOrGroups(String userId, List<String> groups) {
        TaskQuery taskQuery = taskService.createTaskQuery()
                .taskAssignee(userId)
                .or().taskCandidateUser(userId);
        if (!CollectionUtils.isEmpty(groups)) {
            taskQuery.or().taskCandidateGroupIn(groups);
        }
        List<Task> tasks = taskQuery.list();
        return tasks.stream().map(t -> {
            CamundaTask camundaTask = new CamundaTask();
            BeanUtils.copyProperties(t, camundaTask);
            return camundaTask;
        }).toList();
    }

}
