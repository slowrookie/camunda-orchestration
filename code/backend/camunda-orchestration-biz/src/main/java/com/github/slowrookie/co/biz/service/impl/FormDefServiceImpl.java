package com.github.slowrookie.co.biz.service.impl;

import com.github.slowrookie.co.biz.model.FormDef;
import com.github.slowrookie.co.biz.model.FormDefDetail;
import com.github.slowrookie.co.biz.repository.IFormDefDetailRepository;
import com.github.slowrookie.co.biz.repository.IFormDefRepository;
import com.github.slowrookie.co.biz.service.IFormDefService;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FormDefServiceImpl implements IFormDefService {

    @Resource
    private IFormDefRepository formDefRepository;

    @Resource
    private IFormDefDetailRepository formDefDetailRepository;

    @Override
    public Page<FormDef> findAll(PageRequest of) {
        return formDefRepository.findAll(of);
    }

    @Override
    public FormDef get(String id) {
        return formDefRepository.findById(id).orElse(null);
    }

    @Transactional
    @Override
    public FormDefDetail createFormDefDetail(FormDefDetail formDefDetail) {
        formDefDetail.getFormDef().setLastModifiedDate(Instant.now());
        formDefDetail.getFormDef().setRev(formDefDetail.getFormDef().getRev() + 1);
        FormDef formDef = formDefRepository.save(formDefDetail.getFormDef());
        formDefDetail.setVersion(formDef.getRev());
        return formDefDetailRepository.save(formDefDetail);
    }

    @Override
    public FormDefDetail getFormDetailById(String id) {
        return formDefDetailRepository.findById(id).orElse(null);
    }

    @Override
    public FormDefDetail saveFormDefDetail(FormDefDetail formDef) {
        return formDefDetailRepository.save(formDef);
    }

    @Override
    public Iterable<FormDefDetail> findFormDefDetailLatest() {
        List<FormDef> formDefList = formDefRepository.findAll();
        return formDefList.stream().map(f -> f.getFormDefDetails().get(0)).collect(Collectors.toList());
    }
}
