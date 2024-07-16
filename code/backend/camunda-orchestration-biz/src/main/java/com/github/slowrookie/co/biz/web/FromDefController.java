package com.github.slowrookie.co.biz.web;

import com.github.slowrookie.co.biz.dto.FormDefDetailCreate;
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

    @GetMapping("/form-def/details")
    private ResponseEntity<Iterable<FormDefDetail>> formDefDetail() {
        return ResponseEntity.ok(formDefService.findFormDefDetails());
    }

    @GetMapping("/form-def/{formDefId}/details")
    private ResponseEntity<Iterable<FormDefDetail>> formDefDetail(@PathVariable("formDefId") String formDefId) {
        return ResponseEntity.ok(formDefService.findFormDefDetailByFormDefId(formDefId));
    }

    @PutMapping("/form-def")
    private ResponseEntity<FormDefDetail> modify(@RequestBody @Valid FormDefDetailCreate dto) {
        FormDef formDef = null;
        if (StringUtils.hasLength(dto.getFormDefId())) {
            formDef = formDefService.get(dto.getFormDefId());
        } else if (StringUtils.hasLength(dto.getKey())) {
            formDef = formDefService.getByKey(dto.getKey());
        }
        if (null == formDef) {
            formDef = new FormDef();
            formDef.setRev(0);
            formDef.setKey(dto.getKey());
        }
        FormDefDetail detail = new FormDefDetail();
        BeanUtils.copyProperties(dto, detail);
        detail = formDefService.create(formDef, detail);
        return ResponseEntity.ok(detail);
    }

}
