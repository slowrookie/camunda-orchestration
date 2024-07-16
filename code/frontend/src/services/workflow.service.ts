import axios from "axios";


// workflow process instance state enum
export enum ProcessInstanceState {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  COMPLETED = "COMPLETED",
  EXTERNALLY_TERMINATED = "EXTERNALLY_TERMINATED",
  INTERNALLY_TERMINATED = "INTERNALLY_TERMINATED",
}

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

export const processDefinitionStatistics = (): Promise<any> => {
  return axios.get('/api/workflow/process-definition/statistics')
    .then((res) => res.data);
}

export const processDefinitionStatisticsGrouped = (): Promise<any> => {
  return processDefinitionStatistics()
    .then((data) => {
      let rows = new Array<any>();
      data.forEach((item: any) => {
        let definition: any = item.definition;
        let row = rows.find((r) => r.key === definition.key);
        if (!row) {
          row = {
            id: definition.id,
            key: definition.key,
            name: definition.name,
            version: definition.version,
            versionTag: definition.versionTag,
            suspended: definition.suspended,
            incidents: item.incidents,
            instances: item.instances,
            definitions: [definition],
          };
          rows.push(row);
        } else {
          row.id = definition.id;
          row.name = definition.name;
          row.version = definition.version;
          row.versionTag = definition.versionTag;
          row.suspended = definition.suspended;
          row.incidents = Number(row.incidents) + Number(item.incidents.length);
          row.instances = Number(row.instances) + Number(item.instances);
          row.definitions.push(definition);
        }
      });
      return rows;
    });
}

export const processDefinitionXmlById = (id: string): Promise<any> => {
  return axios.get(`/api/workflow/process-definition/${id}/xml`)
    .then((res) => res.data);
}

export const getActivityInstance = (id: string): Promise<any> => {
  return axios.get(`/api/workflow/process-instance/${id}/activity-instances`)
    .then((res) => res.data);
}