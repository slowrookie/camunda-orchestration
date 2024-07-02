package com.github.slowrookie.co.biz.web;

import com.github.slowrookie.co.biz.dto.FormDefDetailAndDataDto;
import com.github.slowrookie.co.biz.model.FormData;
import com.github.slowrookie.co.biz.model.FormDefDetail;
import com.github.slowrookie.co.biz.service.IFormDataService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class FormDataController {

    @Resource
    private IFormDataService formDataService;

    @GetMapping("/from-data/{businessId}")
    private List<FormDefDetailAndDataDto> getFormDefDetailByBusinessId(@PathVariable String businessId) {
        Map<FormDefDetail, List<FormData>> mapped = formDataService.findDataMapByBusinessId(businessId);
        return mapped.entrySet().stream().map(entry -> {
            FormDefDetailAndDataDto dto = new FormDefDetailAndDataDto();
            dto.setDef(entry.getKey());
            dto.setData(entry.getValue());
            return dto;
        }).collect(Collectors.toList());
    }

}
