import { SelectTabData, SelectTabEvent, Tab, TabList, TabValue } from "@fluentui/react-components";
import { DocumentFlowchart20Filled, TaskListLtr20Regular } from "@fluentui/react-icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { Column } from 'react-data-grid';
import DataGrid from 'react-data-grid';
import { getProcessInstanceInfo } from "../../services/workflow-approval.service";
import { BpmnViewer } from "../bpmn/bpmn-viewer.component";

export type IProcessInstanceViewerProps = {
  processInstanceId: string;
}

const taskColumns: readonly Column<any>[] = ([
  {key: 'id', name: 'ID', resizable: true, width: 80},
  {key: 'name', name: '节点', resizable: true, width: 200, renderCell: (data: any) => {
    return <span>{data.row.name}({data.row.taskDefinitionKey})</span>
  }},
  {key: 'assignee', name: '处理人', resizable: true, width: 80},
  {key: 'startTime', name: '开始时间', resizable: true, width: 150, renderCell: (data: any) => {
    return <span>{dayjs(data.row.startTime).format('YYYY-MM-DD HH:mm:ss')}</span>
  }},
  {key: 'endTime', name: '结束时间', resizable: true, width: 150, renderCell: (data: any) => {
    if (!data.row.endTime) {
      return <span></span>
    }
    return <span>{dayjs(data.row.endTime).format('YYYY-MM-DD HH:mm:ss')}</span>
  }},
  {key: 'durationInMillis', name: '持续时间(秒)', resizable: true, renderCell: (data: any) => {
    let duration = data.row.durationInMillis;
    if (!duration) {
      return <span></span>
    }
    let seconds = Math.floor(duration / 1000);
    return <span>{seconds}</span>
  }},
]);



export const ProcessInstanceViewer = (props: IProcessInstanceViewerProps) => {

  const [selectedTabValue, setSelectedTabValue] = useState<TabValue>("diagram");
  const [processInstanceId, setProcessInstanceId] = useState<string | undefined>(props.processInstanceId);
  const [diagramXml, setDiagramXml] = useState<string | undefined>(undefined);
  const [processInstanceInfo, setProcessInstanceInfo] = useState<any | undefined>(undefined);

  const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    event.stopPropagation();
    event.preventDefault();
    setSelectedTabValue(data.value);
  };

  useEffect(() => {
    if (!props.processInstanceId) {
      return;
    }
    getProcessInstanceInfo(props.processInstanceId).then((data: any) => {
      setProcessInstanceInfo(data);
      setDiagramXml(data.bpmn20Xml);
    });
  }, [props.processInstanceId]);

  return (<div>
    <TabList defaultSelectedValue="diagram" selectedValue={selectedTabValue} onTabSelect={handleTabSelect} size="small">
      <Tab icon={<DocumentFlowchart20Filled />} value="diagram">
        流程
      </Tab>
      <Tab icon={<TaskListLtr20Regular />} value="activties">
        节点
      </Tab>
    </TabList>
    <div style={{width: '800px', height: '800px'}}>
      {selectedTabValue === "diagram" && diagramXml && <BpmnViewer diagramXml={diagramXml} historicTasks={processInstanceInfo.historicTasks} 
      currentTasks={processInstanceInfo.currentTasks} />}
      {selectedTabValue === "activties" && <div>
        <DataGrid
          className="fill-grid rdg-light"
          style={{ height: "100%" }}
          columns={taskColumns}
          rows={processInstanceInfo.historicTasks as any}
          rowHeight={30}
          rowKeyGetter={(r: any) => r.key}
        />
      </div>}
      {selectedTabValue === "operations" && <div>operations</div>}
    </div>
    
  </div>);

}