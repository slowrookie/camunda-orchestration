package com.github.slowrookie.co.biz.service;

import com.github.slowrookie.co.biz.model.FormData;
import com.github.slowrookie.co.biz.model.FormDefDetail;

import java.util.List;
import java.util.Map;

public interface IFormDataService {

    List<FormData> findByFormDetailIdAndBusinessId(String formDetailId, String businessId);

    Map<FormDefDetail, List<FormData>> findDataMapByBusinessId(String businessId);
}
