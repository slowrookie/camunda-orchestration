package com.github.slowrookie.co.biz.web;

import com.github.slowrookie.co.biz.dto.FormDefDetailCreateDto;
import com.github.slowrookie.co.biz.model.FormDef;
import com.github.slowrookie.co.biz.model.FormDefDetail;
import com.github.slowrookie.co.biz.service.IFormDefService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * @author jiaxing.liu
 * @date 2024/5/31
 **/
@RestController
public class FromDefController {

    @Resource
    private IFormDefService formDefService;

    @GetMapping("/form-def")
    private Page<FormDef> pages(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return formDefService.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/form-def/detail/latest")
    private ResponseEntity<Iterable<FormDefDetail>> formDefDetailLatest() {
        return ResponseEntity.ok(formDefService.findFormDefDetailLatest());
    }

    @PutMapping("/form-def")
    private ResponseEntity<FormDefDetail> modify(@RequestBody @Valid FormDefDetailCreateDto dto) {
        FormDef formDef = new FormDef();
        if (StringUtils.hasLength(dto.getFormDefId())) {
            formDef = formDefService.get(dto.getFormDefId());
        } else {
            formDef.setRev(0);
            formDef.setKey(dto.getKey());
        }
        FormDefDetail detail = new FormDefDetail();
        BeanUtils.copyProperties(dto, detail);
        detail.setFormDef(formDef);
        detail = formDefService.createFormDefDetail(detail);
        return ResponseEntity.ok(detail);
    }

}
