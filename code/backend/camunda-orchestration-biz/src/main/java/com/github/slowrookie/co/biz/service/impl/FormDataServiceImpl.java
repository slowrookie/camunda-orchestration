package com.github.slowrookie.co.biz.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.slowrookie.co.biz.dto.FormDataConvert;
import com.github.slowrookie.co.biz.model.FormData;
import com.github.slowrookie.co.biz.model.FormDefDetail;
import com.github.slowrookie.co.biz.repository.IFormDataRepository;
import com.github.slowrookie.co.biz.repository.IFormDefDetailRepository;
import com.github.slowrookie.co.biz.service.IFormDataService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FormDataServiceImpl implements IFormDataService {
    @Resource
    private IFormDataRepository formDataRepository;
    @Resource
    private IFormDefDetailRepository formDefDetailRepository;

    @Override
    public Map<FormDefDetail, List<FormDataConvert>> findDataMapByBusinessId(String businessId) {
        List<FormData> formDataList = formDataRepository.findByBusinessId(businessId);
        Set<String> fromDefDetailIds = formDataList.stream().map(FormData::getFormDefDetailId).collect(Collectors.toSet());
        List<FormDefDetail> formDefDetails = formDefDetailRepository.findAllById(fromDefDetailIds);
        Map<FormDefDetail, List<FormDataConvert>> groups = formDefDetails.stream()
                    .collect(Collectors.toMap(formDefDetail -> formDefDetail,
                            formDefDetail -> formDataList.stream()
                                    .filter(formData -> formData.getFormDefDetailId().equals(formDefDetail.getId()))
                                    .map(FormDataConvert::new)
                                    .collect(Collectors.toList()))
                    );
        // convert
        groups.forEach((formDefDetail, formData) -> {
            try {
                convertType(formDefDetail, formData);
            } catch (Exception e) {
                log.error("convert error:", e);
            }
        });
        return groups;
    }

    @Override
    public Map<FormDefDetail, List<FormDataConvert>> findDataMapByProcessInstanceIdAndTaskId(String processInstanceId, String taskId) {
        List<FormData> formDataList = formDataRepository.findByProcessInstanceIdAndTaskId(processInstanceId, taskId);
        Set<String> fromDefDetailIds = formDataList.stream().map(FormData::getFormDefDetailId).collect(Collectors.toSet());
        List<FormDefDetail> formDefDetails = formDefDetailRepository.findAllById(fromDefDetailIds);
        Map<FormDefDetail, List<FormDataConvert>> groups = formDefDetails.stream()
                .collect(Collectors.toMap(formDefDetail -> formDefDetail,
                        formDefDetail -> formDataList.stream()
                                .filter(formData -> formData.getFormDefDetailId().equals(formDefDetail.getId()))
                                .map(FormDataConvert::new)
                                .collect(Collectors.toList()))
                );
        // convert
        groups.forEach((formDefDetail, formData) -> {
            try {
                convertType(formDefDetail, formData);
            } catch (Exception e) {
                log.error("convert error:", e);
            }
        });
        return groups;
    }

    public void convertType(FormDefDetail formDefDetail, List<FormDataConvert> fds) {
        if (Objects.isNull(formDefDetail.getSchemas())) {
            return;
        }
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jn = null;
        try {
            jn = mapper.readTree(formDefDetail.getSchemas());
        } catch (JsonProcessingException e) {
            log.error("parse schema error:", e);
            throw new RuntimeException(e);
        }
        JsonNode schema = jn.get("Schema");
        if (null == schema) {
            return;
        }
        JsonNode properties = schema.get("properties");
        if (null == properties) {
            return;
        }
        Iterator<Map.Entry<String, JsonNode>> fields = properties.fields();

        fields.forEachRemaining(entry -> {
            for (FormDataConvert fd : fds) {
                String key = entry.getKey();
                if (!Objects.equals(fd.getKey(), key)) {
                    continue;
                }
                JsonNode value = entry.getValue();
                String type = value.get("type").asText();
                switch (type) {
                    case "string":
                        // format
                        if (value.has("format")
                                && Objects.nonNull(fd.getValue())
                                && StringUtils.hasLength(fd.getValue().toString())) {
                            String format = value.get("format").asText();
                            if ("date".equals(format)) {
                                fd.setValue(LocalDate.parse(fd.getValue().toString()));
                            } else if ("date-time".equals(format)) {
                                LocalDateTime dateTime = LocalDateTime.parse(fd.getValue().toString(), DateTimeFormatter.ISO_DATE_TIME);
                                fd.setValue(dateTime);
                            }
                        }
                        break;
                    case "integer":
                        fd.setValue(Integer.parseInt(fd.getValue().toString()));
                        break;
                    case "boolean":
                        fd.setValue(Boolean.parseBoolean(fd.getValue().toString()));
                        break;
                    case "number":
                        fd.setValue(Double.parseDouble(fd.getValue().toString()));
                        break;
                    default:
                        break;
                }
            }
        });
    }
}
