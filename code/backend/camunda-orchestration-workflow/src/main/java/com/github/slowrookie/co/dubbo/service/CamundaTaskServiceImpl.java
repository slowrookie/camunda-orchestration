package com.github.slowrookie.co.dubbo.service;


import com.github.slowrookie.co.dubbo.api.ICamundaTaskService;
import com.github.slowrookie.co.dubbo.model.CamundaTask;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.impl.TaskQueryImpl;
import org.camunda.bpm.engine.impl.TaskServiceImpl;
import org.camunda.bpm.engine.task.Task;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;

@Service
@DubboService
public class CamundaTaskServiceImpl implements ICamundaTaskService {

    @Resource
    private TaskServiceImpl taskService;

    @Override
    public List<CamundaTask> getTaskByUserIdOrGroups(String userId, List<String> groups) {
        TaskQueryImpl taskQuery = (TaskQueryImpl) taskService.createTaskQuery();
        taskQuery.or()
                .taskAssignee(userId)
                .taskCandidateUser(userId);
        if (!CollectionUtils.isEmpty(groups)) {
            taskQuery.or().taskCandidateGroupIn(groups);
        }

        taskQuery.setCommandExecutor(taskService.getCommandExecutor());
        List<Task> tasks = taskQuery.list();

        return tasks.stream().map(t -> {
            CamundaTask camundaTask = new CamundaTask();
            BeanUtils.copyProperties(t, camundaTask, "formKey");
            return camundaTask;
        }).toList();
    }

    @Override
    public CamundaTask getTaskById(String taskId) {
        Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
        if (task == null) {
            return null;
        }
        CamundaTask camundaTask = new CamundaTask();
        BeanUtils.copyProperties(task, camundaTask, "formKey");
        return camundaTask;
    }

    @Override
    public void complete(String taskId, Map<String, Object> variables) {
        taskService.complete(taskId, variables);
    }
}
