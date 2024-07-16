package com.github.slowrookie.co.biz.dto;

import com.github.slowrookie.co.biz.model.FormData;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormDataConvert implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String key;

    private Object value;

    private String formDefDetailId;

    private String businessId;

    private String processInstanceId;

    private String taskId;

    private Instant createdDate;

    private String createdBy;

    private Instant lastModifiedDate;

    private String lastModifiedBy;

    public FormDataConvert(FormData fd) {
        this.id = fd.getId();
        this.key = fd.getKey();
        this.value = fd.getValue();
        this.formDefDetailId = fd.getFormDefDetailId();
        this.businessId = fd.getBusinessId();
        this.processInstanceId = fd.getProcessInstanceId();
        this.taskId = fd.getTaskId();
        this.createdDate = fd.getCreatedDate();
        this.createdBy = fd.getCreatedBy();
        this.lastModifiedDate = fd.getLastModifiedDate();
        this.lastModifiedBy = fd.getLastModifiedBy();
    }

    public FormData toFormData() {
        FormData fd = new FormData();
        fd.setId(this.id);
        fd.setKey(this.key);
        fd.setValue(Objects.isNull(this.value) ? "" : this.value.toString());
        fd.setFormDefDetailId(this.formDefDetailId);
        fd.setBusinessId(this.businessId);
        fd.setProcessInstanceId(this.processInstanceId);
        fd.setTaskId(this.taskId);
        fd.setCreatedDate(this.createdDate);
        fd.setCreatedBy(this.createdBy);
        fd.setLastModifiedDate(this.lastModifiedDate);
        fd.setLastModifiedBy(this.lastModifiedBy);
        return fd;
    }

}
