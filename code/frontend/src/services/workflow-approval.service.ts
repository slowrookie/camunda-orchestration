import axios from "axios";
import { Page, PageRequest } from "./api.service";


export type WorkflowApproval = {
  id: string,
  title: string;
  formDefDetailId?: string;
  formData?: any;
  processDefinitionId?: string,
  latestProcessInstanceNode?: string;
  processInstanceId?: string;
}

export const getWorkflowApprovals = async (pageRequest: PageRequest): Promise<Page<WorkflowApproval>> => {
  return axios.get(`/api/biz/workflow-approval?page=${pageRequest.number}&size=${pageRequest.size}`)
    .then((res) => res.data);
}

export const getWorkflowApprovalsPending = async (pageRequest: PageRequest): Promise<Page<WorkflowApproval>> => {
  return axios.get(`/api/biz/workflow-approval/pending?page=${pageRequest.number}&size=${pageRequest.size}`)
    .then((res) => res.data);
}

export const startWorkflowApproval = async (u: WorkflowApproval): Promise<WorkflowApproval> => {
  return axios.post('/api/biz/workflow-approval/start', u)
    .then((res) => res.data);
}

