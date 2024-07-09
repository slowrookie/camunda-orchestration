package com.github.slowrookie.co.dubbo.api;

import com.github.slowrookie.co.dubbo.model.CamundaTask;

import java.util.List;
import java.util.Map;

public interface ICamundaTaskService {

    List<CamundaTask> getTaskByUserIdOrGroups(String userId, List<String> groups);

    CamundaTask getTaskById(String taskId);

    void complete(String taskId, Map<String, Object> variables);

}
