package com.github.slowrookie.co.biz.service;

import com.github.slowrookie.co.biz.model.FormDef;
import com.github.slowrookie.co.biz.model.FormDefDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface IFormDefService {

    Page<FormDef> findAll(PageRequest of);

    FormDef get(String id);

    FormDef getByKey(String key);

    FormDefDetail create(FormDef formDef, FormDefDetail formDefDetail);

    Iterable<FormDefDetail> findFormDefDetailLatest();

    Iterable<FormDefDetail> findFormDefDetailByFormDefId(String formDefId);

    Iterable<FormDefDetail> findFormDefDetails();

}
