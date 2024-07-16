package com.github.slowrookie.co.biz.dto;

import com.github.slowrookie.co.biz.model.FormData;
import com.github.slowrookie.co.biz.model.FormDefDetail;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
public class FormDefDetailWithData implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private FormDefDetail def;

    private List<FormDataConvert> data;

}
