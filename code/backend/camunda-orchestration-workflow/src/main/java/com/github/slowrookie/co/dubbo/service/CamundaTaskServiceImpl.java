package com.github.slowrookie.co.dubbo.service;


import com.github.slowrookie.co.dubbo.api.ICamundaTaskService;
import com.github.slowrookie.co.dubbo.model.CamundaIdentityLink;
import com.github.slowrookie.co.dubbo.model.CamundaTask;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.impl.TaskQueryImpl;
import org.camunda.bpm.engine.impl.TaskServiceImpl;
import org.camunda.bpm.engine.task.IdentityLink;
import org.camunda.bpm.engine.task.Task;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@DubboService
public class CamundaTaskServiceImpl implements ICamundaTaskService {

    @Resource
    private TaskServiceImpl taskService;

    @Override
    public List<CamundaTask> getTaskByUserIdOrGroups(String userId, List<String> groups) {
        TaskQueryImpl userTaskQuery = (TaskQueryImpl) taskService.createTaskQuery();
        userTaskQuery.setCommandExecutor(taskService.getCommandExecutor());
        userTaskQuery.taskInvolvedUser(userId);
        List<Task> userTasks = userTaskQuery.list();
        Set<Task> tasks = new HashSet<>(userTasks);

        if (!CollectionUtils.isEmpty(groups)) {
            TaskQueryImpl groupTaskQuery = (TaskQueryImpl) taskService.createTaskQuery();
            groupTaskQuery.taskCandidateGroupIn(groups);
            groupTaskQuery.includeAssignedTasks();
            groupTaskQuery.setCommandExecutor(taskService.getCommandExecutor());
            List<Task> groupTasks = groupTaskQuery.list();
            tasks.addAll(groupTasks);
        }

        return tasks.stream().map(t -> {
            CamundaTask camundaTask = new CamundaTask();
            BeanUtils.copyProperties(t, camundaTask, "formKey");
            return camundaTask;
        }).toList();
    }

    @Override
    public List<CamundaTask> getTasksByProcessInstanceId(String processInstanceId) {
        List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).list();
        return tasks.stream().map(t -> {
            CamundaTask camundaTask = new CamundaTask();
            BeanUtils.copyProperties(t, camundaTask, "formKey");
            return camundaTask;
        }).toList();
    }

    @Override
    public Map<String, List<CamundaIdentityLink>> getTaskIdentityLinks(Set<String> taskIds) {
        if (CollectionUtils.isEmpty(taskIds)) {
            return new HashMap<>();
        }
        Map<String, List<CamundaIdentityLink>> result = new HashMap<>();
        for (String taskId : taskIds) {
            List<IdentityLink> identityLinks = taskService.getIdentityLinksForTask(taskId);
            result.put(taskId, identityLinks.stream().map(v -> {
                CamundaIdentityLink link = new CamundaIdentityLink();
                BeanUtils.copyProperties(v, link);
                return link;
            }).toList());
        }
        return result;
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

    @Transactional
    @Override
    public void completeWithUser(String userId, String taskId, Map<String, Object> variables) {
        Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
        if (null == task) {
            return;
        }
        if (!task.getAssignee().equals(userId)) {
            taskService.delegateTask(taskId, userId);
        }
        taskService.complete(taskId, variables);
    }
}
