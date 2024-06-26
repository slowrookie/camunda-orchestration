package com.github.slowrookie.co.biz.service;

import com.github.slowrookie.co.biz.model.FormDef;
import com.github.slowrookie.co.biz.model.FormDefDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface IFormDefService {

    Page<FormDef> findAll(PageRequest of);

    FormDef get(String id);

    FormDefDetail createFormDefDetail(FormDefDetail formDefDetail);

    FormDefDetail getFormDetailById(String id);

    FormDefDetail saveFormDefDetail(FormDefDetail formDefDetail);

    Iterable<FormDefDetail> findFormDefDetailLatest();
}
