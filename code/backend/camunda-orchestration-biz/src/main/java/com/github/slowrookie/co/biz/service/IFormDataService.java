package com.github.slowrookie.co.biz.service;

import com.github.slowrookie.co.biz.dto.FormDataConvert;
import com.github.slowrookie.co.biz.model.FormDefDetail;

import java.util.List;
import java.util.Map;

public interface IFormDataService {

    Map<FormDefDetail, List<FormDataConvert>> findDataMapByBusinessId(String businessId);

    Map<FormDefDetail, List<FormDataConvert>> findDataMapByProcessInstanceIdAndTaskId(String processInstanceId, String taskId);

    void convertType(FormDefDetail formDefDetail, List<FormDataConvert> fds);

}
