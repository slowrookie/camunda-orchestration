package com.github.slowrookie.co.dubbo.model;


import lombok.Data;
import org.camunda.bpm.engine.impl.persistence.entity.ActivityInstanceImpl;
import org.camunda.bpm.engine.impl.util.EnsureUtil;
import org.camunda.bpm.engine.runtime.ActivityInstance;
import org.camunda.bpm.engine.runtime.TransitionInstance;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class CamundaActivityInstance implements ActivityInstance, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String parentActivityInstanceId;

    private String processInstanceId;

    private String processDefinitionId;

    private String activityId;

    private String activityName;

    private String activityType;

    private CamundaActivityInstance[] childActivityInstances;

    private CamundaTransitionInstance[] childTransitionInstances;

    private String[] executionIds;

    private String[] incidentIds;

    private CamundaIncident[] incidents;

    public ActivityInstance[] getActivityInstances(String activityId) {
        EnsureUtil.ensureNotNull("activityId", activityId);

        List<ActivityInstance> instances = new ArrayList<ActivityInstance>();
        collectActivityInstances(activityId, instances);

        return instances.toArray(new ActivityInstance[instances.size()]);
    }

    protected void collectActivityInstances(String activityId, List<ActivityInstance> instances) {
        if (this.activityId.equals(activityId)) {
            instances.add(this);
        }
        else {
            for (CamundaActivityInstance childInstance : childActivityInstances) {
                childInstance.collectActivityInstances(activityId, instances);
            }
        }
    }

    public TransitionInstance[] getTransitionInstances(String activityId) {
        EnsureUtil.ensureNotNull("activityId", activityId);

        List<TransitionInstance> instances = new ArrayList<TransitionInstance>();
        collectTransitionInstances(activityId, instances);

        return instances.toArray(new TransitionInstance[instances.size()]);
    }

    protected void collectTransitionInstances(String activityId, List<TransitionInstance> instances) {
        boolean instanceFound = false;

        for (TransitionInstance childTransitionInstance : childTransitionInstances) {
            if (activityId.equals(childTransitionInstance.getActivityId())) {
                instances.add(childTransitionInstance);
                instanceFound = true;
            }
        }

        if (!instanceFound) {
            for (CamundaActivityInstance childActivityInstance : childActivityInstances) {
                childActivityInstance.collectTransitionInstances(activityId, instances);
            }
        }
    }

}
