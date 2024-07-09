package com.github.slowrookie.co.biz.service.impl;

import com.github.slowrookie.co.biz.model.FormData;
import com.github.slowrookie.co.biz.model.FormDefDetail;
import com.github.slowrookie.co.biz.repository.IFormDataRepository;
import com.github.slowrookie.co.biz.repository.IFormDefDetailRepository;
import com.github.slowrookie.co.biz.service.IFormDataService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FormDataServiceImpl implements IFormDataService {
    @Resource
    private IFormDataRepository formDataRepository;
    @Resource
    private IFormDefDetailRepository formDefDetailRepository;

    @Override
    public List<FormData> findByFormDetailIdAndBusinessId(String formDetailId, String businessId) {
        return formDataRepository.findByFormDefDetailIdAndBusinessId(formDetailId, businessId);
    }

    @Override
    public Map<FormDefDetail, List<FormData>> findDataMapByBusinessId(String businessId) {
        List<FormData> formDataList = formDataRepository.findByBusinessId(businessId);
        Set<String> fromDefDetailIds = formDataList.stream().map(FormData::getFormDefDetailId).collect(Collectors.toSet());
        List<FormDefDetail> formDefDetails = formDefDetailRepository.findAllById(fromDefDetailIds);
        return formDefDetails.stream()
                .collect(Collectors.toMap(formDefDetail -> formDefDetail, formDefDetail -> formDataList.stream()
                        .filter(formData -> formData.getFormDefDetailId().equals(formDefDetail.getId()))
                        .collect(Collectors.toList())));

    }
}
