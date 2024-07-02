package com.github.slowrookie.co.dubbo.api;

import com.github.slowrookie.co.dubbo.model.CamundaTask;

import java.util.List;

public interface ICamundaTaskService {

    List<CamundaTask> getTaskByUserIdOrGroups(String userId, List<String> groups);

}
