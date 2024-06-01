package com.github.slowrookie.co.biz.service;

import com.github.slowrookie.co.biz.model.FormDef;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * @author jiaxing.liu
 * @date 2024/5/31
 **/
public interface IFormDefService {

    Page<FormDef> findAll(PageRequest of);

}
