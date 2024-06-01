package com.github.slowrookie.co.biz.service.impl;

import com.github.slowrookie.co.biz.model.FormDef;
import com.github.slowrookie.co.biz.repository.IFormDefRepository;
import com.github.slowrookie.co.biz.service.IFormDefService;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

/**
 * @author jiaxing.liu
 * @date 2024/5/31
 **/
@Service
public class IFormDefServiceImpl implements IFormDefService {

    @Resource
    private IFormDefRepository formDefRepository;

    @Override
    public Page<FormDef> findAll(PageRequest of) {
        return formDefRepository.findAll(of);
    }
}
