import axios from "axios";
import { Page, PageRequest } from "./api.service";

export type FormDef = {
  id: string;
  key: string;
  rev: number;
}

export type FormDefDetail = {
  id: string,
  name: string;
  key: string;
  schemas: string;
  enable: boolean;
  version?: string;
  formDefId?: string;
}

export type FromDefAndData = {
  def: FormDefDetail,
  data: any
}

export const getFormDefs = async (pageRequest: PageRequest): Promise<Page<FormDef>> => {
  return axios.get(`/api/biz/form-def?page=${pageRequest.number}&size=${pageRequest.size}`)
    .then((res) => res.data);
}

export const getFormDefDetailLatest = async (): Promise<FormDefDetail[]> => {
  return axios.get(`/api/biz/form-def/detail/latest`)
    .then((res) => res.data);
}

export const getFormDefDetails = async (): Promise<FormDefDetail[]> => {
  return axios.get(`/api/biz/form-def/details`)
    .then((res) => res.data);
}

export const getFormDefDetailsByFormDefId = async (formDefId: string): Promise<FormDefDetail[]> => {
  return axios.get(`/api/biz/form-def/${formDefId}/details`)
    .then((res) => res.data);
}

export const createOrModifyFormDef = async (u: FormDefDetail): Promise<FormDefDetail> => {
  return axios.put('/api/biz/form-def', u)
    .then((res) => res.data);
}

export const getFormDataByBusinessId = async (businessId: string): Promise<FromDefAndData[]> => {
  return axios.get(`/api/biz/from-data/${businessId}`)
    .then((res) => res.data);
}
