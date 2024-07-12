package com.github.slowrookie.co.dubbo.model;

import lombok.Data;
import org.camunda.bpm.engine.task.IdentityLink;

import java.io.Serial;
import java.io.Serializable;

@Data
public class CamundaIdentityLink implements IdentityLink, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String type;

    private String userId;

    private String groupId;

    private String taskId;

    private String processDefId;

    private String tenantId;

}
