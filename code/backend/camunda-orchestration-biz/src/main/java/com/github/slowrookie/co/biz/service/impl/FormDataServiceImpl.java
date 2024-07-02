package com.github.slowrookie.co.biz.service.impl;

import com.github.slowrookie.co.biz.model.FormData;
import com.github.slowrookie.co.biz.model.FormDefDetail;
import com.github.slowrookie.co.biz.repository.IFormDataRepository;
import com.github.slowrookie.co.biz.service.IFormDataService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FormDataServiceImpl implements IFormDataService {
    @Resource
    private IFormDataRepository formDataRepository;

    @Override
    public List<FormData> findByFormDetailIdAndBusinessId(String formDetailId, String businessId) {
        return formDataRepository.findByFormDefDetailIdAndBusinessId(formDetailId, businessId);
    }

    @Override
    public Map<FormDefDetail, List<FormData>> findDataMapByBusinessId(String businessId) {
        return formDataRepository.findByBusinessId(businessId)
                .stream()
                .collect(Collectors.groupingBy(FormData::getFormDefDetail));

    }
}
