import { SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { DocumentFlowchart20Filled, TaskListLtr20Regular, PointScan20Regular } from "@fluentui/react-icons";
import { getActivityInstance, processDefinitionXmlById } from "../../services/workflow.service";
import { BpmnViewer } from "../bpmn/bpmn-viewer.component";
import type { Column } from 'react-data-grid';
import DataGrid from 'react-data-grid';

export type IProcessInstanceViewerProps = {
  processDefinitionId: string;
  processInstanceId?: string;
}

const activitiesColumns: readonly Column<any>[] = ([
  {key: 'id', name: 'ID', resizable: true,},
  {key: 'activityId', name: 'Activity Id', resizable: true,},
  {key: 'activityType', name: 'Activity Type', resizable: true,},
  {key: 'name', name: 'name', resizable: true,},
]);



export const ProcessInstanceViewer = (props: IProcessInstanceViewerProps) => {

  const [selectedTabValue, setSelectedTabValue] = useState<TabValue>("diagram");
  const [processInstanceId, setProcessInstanceId] = useState<string | undefined>(props.processInstanceId);
  const [processDefinitionId, setProcessDefinitionId] = useState<string | undefined>(props.processDefinitionId);
  const [diagramXml, setDiagramXml] = useState<string | undefined>(undefined);
  const [activityInstances, setActivityInstances] = useState<any[] | undefined>(undefined);

  const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    event.stopPropagation();
    event.preventDefault();
    setSelectedTabValue(data.value);
  };

  useEffect(() => {
    if (!props.processDefinitionId) {
      return;
    }
    processDefinitionXmlById(props.processDefinitionId).then((data) => {
      setDiagramXml(data.bpmn20Xml);
    });
  }, [props.processDefinitionId]);

  useEffect(() => {
    if (!props.processInstanceId) {
      return;
    }
    getActivityInstance(props.processInstanceId).then((data) => {
      if (data.childActivityInstances) {
        setActivityInstances(data.childActivityInstances);
      }
    });
  }, [props.processInstanceId])

  return (<div>
    <TabList defaultSelectedValue="diagram" selectedValue={selectedTabValue} onTabSelect={handleTabSelect} size="small">
      <Tab icon={<DocumentFlowchart20Filled />} value="diagram">
        流程
      </Tab>
      <Tab icon={<TaskListLtr20Regular />} value="activties">
        节点
      </Tab>
      <Tab icon={<PointScan20Regular />} value="operations">
        操作
      </Tab>
    </TabList>
    <div style={{width: '800px', height: '800px'}}>
      {selectedTabValue === "diagram" && diagramXml && <BpmnViewer diagramXml={diagramXml} activityInstances={activityInstances}/>}
      {selectedTabValue === "activties" && <div>
        <DataGrid
          className="fill-grid rdg-light"
          style={{ height: "100%" }}
          columns={activitiesColumns}
          rows={activityInstances as any}
          rowHeight={30}
          rowKeyGetter={(r: any) => r.key}
        />
      </div>}
      {selectedTabValue === "operations" && <div>operations</div>}
    </div>
    
  </div>);

}