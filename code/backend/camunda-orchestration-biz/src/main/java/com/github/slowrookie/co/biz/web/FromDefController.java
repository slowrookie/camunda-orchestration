package com.github.slowrookie.co.biz.web;

import com.github.slowrookie.co.biz.model.FormDef;
import com.github.slowrookie.co.biz.service.IFormDefService;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author jiaxing.liu
 * @date 2024/5/31
 **/
@RestController
public class FromDefController {

    @Resource
    private IFormDefService formDefService;

    @GetMapping("/form-defs")
    private Page<FormDef> queryUsersByPage(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return formDefService.findAll(PageRequest.of(page, size));
    }

}
