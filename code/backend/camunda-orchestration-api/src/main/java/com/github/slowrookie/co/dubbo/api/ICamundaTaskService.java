package com.github.slowrookie.co.dubbo.api;

import com.github.slowrookie.co.dubbo.model.CamundaIdentityLink;
import com.github.slowrookie.co.dubbo.model.CamundaTask;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface ICamundaTaskService {

    List<CamundaTask> getTaskByUserIdOrGroups(String userId, List<String> groups);

    List<CamundaTask> getTasksByProcessInstanceId(String processInstanceId);

    Map<String, List<CamundaIdentityLink>> getTaskIdentityLinks(Set<String> taskIds);

    CamundaTask getTaskById(String taskId);

    void completeWithUser(String userId, String taskId, Map<String, Object> variables);

    void complete(String taskId, Map<String, Object> variables);

}
