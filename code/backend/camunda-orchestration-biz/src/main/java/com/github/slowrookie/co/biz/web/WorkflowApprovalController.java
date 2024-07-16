package com.github.slowrookie.co.biz.web;

import com.github.slowrookie.auth.dubbo.api.IAuthGroupService;
import com.github.slowrookie.auth.dubbo.api.IAuthUserService;
import com.github.slowrookie.auth.dubbo.model.AuthGroup;
import com.github.slowrookie.auth.dubbo.model.AuthUser;
import com.github.slowrookie.co.biz.dto.ProcessInstanceInfo;
import com.github.slowrookie.co.biz.dto.WorkflowApprovalProcess;
import com.github.slowrookie.co.biz.dto.WorkflowApprovalRes;
import com.github.slowrookie.co.biz.dto.WorkflowApprovalStart;
import com.github.slowrookie.co.biz.model.WorkflowApproval;
import com.github.slowrookie.co.biz.service.IWorkflowApprovalService;
import com.github.slowrookie.co.dubbo.api.ICamundaHistoryService;
import com.github.slowrookie.co.dubbo.api.ICamundaRepositoryService;
import com.github.slowrookie.co.dubbo.api.ICamundaTaskService;
import com.github.slowrookie.co.dubbo.model.*;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.apache.dubbo.config.annotation.DubboReference;
import org.camunda.bpm.engine.task.IdentityLink;
import org.camunda.bpm.engine.task.IdentityLinkType;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@RestController
public class WorkflowApprovalController {

    @DubboReference
    private IAuthUserService userService;
    @DubboReference
    private IAuthGroupService groupService;

    @Resource
    private IWorkflowApprovalService workflowApprovalService;
    @DubboReference
    private ICamundaTaskService camundaTaskService;
    @DubboReference
    private ICamundaRepositoryService camundaRepositoryService;
    @DubboReference
    private ICamundaHistoryService camundaHistoryService;

    @GetMapping("/workflow-approval")
    public Page<WorkflowApprovalRes> pages(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        // order by created time desc
        pageRequest = pageRequest.withSort(Sort.Direction.DESC, "createdDate");
        Page<WorkflowApproval> workflowApprovals = workflowApprovalService.findAll(pageRequest);

        Set<String> processInstanceIds = workflowApprovals.stream().map(WorkflowApproval::getProcessInstanceId).collect(Collectors.toSet());
        List<CamundaHistoricProcessInstance> processInstances = camundaHistoryService.getHistoricProcessInstanceByIds(processInstanceIds);
        Set<String> processDefinitionIds = workflowApprovals.stream().map(WorkflowApproval::getProcessDefinitionId).collect(Collectors.toSet());
        List<CamundaProcessDefinition> processDefinitions = camundaRepositoryService.getProcessDefinitionByIds(processDefinitionIds);

        return workflowApprovals.map(wa -> {
            WorkflowApprovalRes resDto = new WorkflowApprovalRes();
            BeanUtils.copyProperties(wa, resDto);
            processInstances.stream().filter(p -> p.getId().equals(wa.getProcessInstanceId())).findFirst().ifPresent(resDto::setProcessInstance);
            processDefinitions.stream().filter(p -> p.getId().equals(wa.getProcessDefinitionId())).findFirst().ifPresent(resDto::setProcessDefinition);
            return resDto;
        });
    }

    @GetMapping("/workflow-approval/pending")
    public Page<WorkflowApprovalRes> pendingPages(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size, Authentication auth) {
        String userId = auth.getName();
        List<String> groupIds = userService.getGroups(userId).stream().map(AuthGroup::getId).toList();
        List<CamundaTask> tasks = camundaTaskService.getTaskByUserIdOrGroups(userId, groupIds);
        Set<String> processInstanceIds = tasks.stream().map(CamundaTask::getProcessInstanceId).collect(Collectors.toSet());
        if (CollectionUtils.isEmpty(processInstanceIds)) {
            return Page.empty();
        }

        PageRequest pageRequest = PageRequest.of(page, size);
        // order by created time desc
        pageRequest = pageRequest.withSort(Sort.Direction.DESC, "createdDate");

        Page<WorkflowApproval> workflowApprovals = workflowApprovalService.findAllPending(userId,
                processInstanceIds,
                pageRequest);

        List<CamundaHistoricProcessInstance> processInstances = camundaHistoryService.getHistoricProcessInstanceByIds(processInstanceIds);
        Set<String> processDefinitionIds = workflowApprovals.stream().map(WorkflowApproval::getProcessDefinitionId).collect(Collectors.toSet());
        List<CamundaProcessDefinition> processDefinitions = camundaRepositoryService.getProcessDefinitionByIds(processDefinitionIds);


        return workflowApprovals.map(wa -> {
            WorkflowApprovalRes dto = new WorkflowApprovalRes();
            BeanUtils.copyProperties(wa, dto);
            tasks.stream().filter(t -> t.getProcessInstanceId().equals(wa.getProcessInstanceId())).findFirst().ifPresent(dto::setCurrentTask);
            processInstances.stream().filter(p -> p.getId().equals(wa.getProcessInstanceId())).findFirst().ifPresent(dto::setProcessInstance);
            processDefinitions.stream().filter(p -> p.getId().equals(wa.getProcessDefinitionId())).findFirst().ifPresent(dto::setProcessDefinition);
            return dto;
        });
    }

    @PostMapping("/workflow-approval/start")
    public void start(@RequestBody @Valid WorkflowApprovalStart dto) {
        workflowApprovalService.start(dto);
    }

    @PostMapping("/workflow-approval/process")
    public void process(@RequestBody @Valid WorkflowApprovalProcess dto, Authentication auth) {
        CamundaTask task = camundaTaskService.getTaskById(dto.getTaskId());
        if (task == null) {
            throw new RuntimeException("task not found");
        }

        WorkflowApproval workflowApproval = workflowApprovalService.getById(dto.getId());
        if (null == workflowApproval) {
            throw new RuntimeException("workflow approval not found");
        }

        String userId = auth.getName();

        workflowApprovalService.process(userId, workflowApproval, task, dto.getFormData(), dto.getNewFormData());
    }

    @GetMapping("/workflow-approval/process-instance-info/{processInstanceId}")
    public ProcessInstanceInfo processInstanceInfo(@PathVariable String processInstanceId) {
        ProcessInstanceInfo info = new ProcessInstanceInfo();

        CamundaHistoricProcessInstance processInstance = camundaHistoryService.getHistoricProcessInstanceById(processInstanceId);
        if (Objects.nonNull(processInstance)) {
            info.setProcessInstance(processInstance);
        }

        CamundaProcessDefinition processDefinition = camundaRepositoryService.getProcessDefinitionById(processInstance.getProcessDefinitionId());
        if (Objects.nonNull(processDefinition)) {
            info.setProcessDefinition(processDefinition);
        }

        Set<String> userIds = new HashSet<>();
        Set<String> groupIds = new HashSet<>();

        List<CamundaHistoricTaskInstance> historicTaskInstances = camundaHistoryService.getHistoricTaskInstance(processInstanceId);
        if (!CollectionUtils.isEmpty(historicTaskInstances)) {
            info.setUserTasks(historicTaskInstances);
            userIds.addAll(historicTaskInstances.stream().map(CamundaHistoricTaskInstance::getAssignee).filter(Objects::nonNull).collect(Collectors.toSet()));
        }

        List<CamundaHistoricActivityInstance> historicActivityInstances = camundaHistoryService.getHistoricActivityInstance(processInstanceId);
        if (!CollectionUtils.isEmpty(historicActivityInstances)) {
            info.setActivityInstances(historicActivityInstances);
        }

        List<CamundaTask> currentTasks = camundaTaskService.getTasksByProcessInstanceId(processInstanceId);
        if (!CollectionUtils.isEmpty(currentTasks)) {
            info.setCurrentTasks(currentTasks);
            Map<String, List<CamundaIdentityLink>> taskLinkMap = camundaTaskService.getTaskIdentityLinks(currentTasks.stream().map(CamundaTask::getId).collect(Collectors.toSet()));
            currentTasks.forEach(t -> {
                List<CamundaIdentityLink> links = taskLinkMap.get(t.getId());
                Set<String> candidateUsers = links.stream()
                        .filter(link -> IdentityLinkType.CANDIDATE.equals(link.getType()) && link.getUserId() != null)
                        .map(IdentityLink::getUserId)
                        .collect(Collectors.toSet());
                userIds.addAll(candidateUsers);
                Set<String> candidateGroups = links.stream()
                        .filter(link -> IdentityLinkType.CANDIDATE.equals(link.getType()) && link.getGroupId() != null)
                        .map(IdentityLink::getGroupId)
                        .collect(Collectors.toSet());
                groupIds.addAll(candidateGroups);
                t.setCandidateUsers(candidateUsers);
                t.setCandidateGroups(candidateGroups);
            });
        }
        info.setCurrentTasks(currentTasks);

        if (!CollectionUtils.isEmpty(userIds)) {
            List<AuthUser> users = userService.getUsers(new ArrayList<>(userIds));
            currentTasks.forEach(t -> {
                users.stream().filter(u -> u.getId().equals(t.getAssignee())).findFirst().ifPresent(u -> t.setAssignee(u.getUsername()));
                t.setCandidateUsers(t.getCandidateUsers().stream()
                        .map(u -> users.stream().filter(user -> user.getId().equals(u)).findFirst()
                                .map(AuthUser::getUsername).orElse(u)).collect(Collectors.toSet()));
            });
            historicTaskInstances.forEach(t -> {
                users.stream().filter(u -> u.getId().equals(t.getAssignee())).findFirst().ifPresent(u -> t.setAssignee(u.getUsername()));
            });
        }

        if (!CollectionUtils.isEmpty(groupIds)) {
            List<AuthGroup> groups = groupService.getGroups(new ArrayList<>(groupIds));
            currentTasks.forEach(t -> {
                t.setCandidateGroups(t.getCandidateGroups().stream()
                        .map(g -> groups.stream().filter(group -> group.getId().equals(g)).findFirst()
                                .map(AuthGroup::getName).orElse(g)).collect(Collectors.toSet()));
            });
        }

        String bpmnXml = camundaRepositoryService.getProcessDefinitionBpmnXml(processDefinition.getId());
        info.setBpmn20Xml(bpmnXml);

        return info;
    }



}
