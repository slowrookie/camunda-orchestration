import axios from "axios";


export const deploymentCreate = async (diagram: string): Promise<any> => {
  // convert string to file
  const blob = new Blob([diagram], { type: 'text/xml' });

  const formdata = new FormData();
  formdata.append('data', blob, 'diagram.bpmn');
  formdata.append('deployment-source', 'workflow-designer');
  formdata.append('enable-duplicate-filtering', 'true');

  return axios.postForm('/api/workflow/deployment/create', formdata)
    .then((res) => res.data);
}

export const processDefinitionStatistics = () : Promise<any> => {
  return axios.get('/api/workflow/process-definition/statistics')
    .then((res) => res.data);
}

export const processDefinitionXmlById = (id: string): Promise<any> => {
  return axios.get(`/api/workflow/process-definition/${id}/xml`)
    .then((res) => res.data);
}