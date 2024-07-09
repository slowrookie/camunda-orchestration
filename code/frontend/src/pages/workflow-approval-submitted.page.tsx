import {
  Badge,
  Link,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Spinner,
  Toolbar,
  ToolbarButton,
  Tooltip,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { Add20Regular, Dismiss20Regular } from '@fluentui/react-icons';
import { UIEvent, useCallback, useEffect, useState } from 'react';
import type { Column } from 'react-data-grid';
import DataGrid from 'react-data-grid';
import { ProcessInstanceViewer } from '../components/process/process-instance-viewer.component';
import { IWorkflowApprovalFormProps, WorkflowApprovalForm } from '../components/workflow-approval/worflow-approval-form.component';
import { Page } from '../services/api.service';
import { FormDef } from '../services/form.service';
import { WorkflowApproval, getWorkflowApprovals } from '../services/workflow-approval.service';
import dayjs from 'dayjs';
import { ProcessInstanceState } from '../services/workflow.service';

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: tokens.spacingHorizontalXS,
  },
  toolbar: {

  },
  drawer: {
    // transitionDuration: '0s',
  },
  drawerBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    boxSizing: 'border-box'
  },
  drawerFooter: {
    justifyContent: 'flex-end',
  },
  dataGrid: {
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    paddingTop: tokens.spacingHorizontalXS,
    flex: "1 1 auto",
  },
  loadMore: {
    paddingBlock: "8px",
    paddingInline: "16px",
    position: "absolute",
    insetBlockEnd: "8px",
    insetInlineEnd: "8px",
    lineHeight: "35px",
  },
});

const PAGE_SIZE = 100;

export const WorkflowApprovalSubmittedPage = () => {
  const styles = useStyles();

  // create
  const [workflowApprovalFormProps, setWorkflowApprovalFormProps] = useState<IWorkflowApprovalFormProps>({
    isOpen: false,
    readonly: false,
    onSubmitted: () => { setPageRequest({ number: 0, size: PAGE_SIZE }); },
    onOpenChange: (open: boolean) => { 
      setWorkflowApprovalFormProps({ ...workflowApprovalFormProps, isOpen: open });
    }
  });
  // grid data
  const [pageReuqest, setPageRequest] = useState({ number: 0, size: PAGE_SIZE });
  const [currentPage, setCurrentPage] = useState<Page<WorkflowApproval>>();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const columns: readonly Column<FormDef>[] = ([
    {
      key: 'id', name: 'ID', resizable: true, renderCell: (data: any) => {
        return <Link onClick={() => { }}>{data.row.id}</Link>
      }
    },
    {
      key: 'title', name: '标题', resizable: true, renderCell: (data: any) => {
        return <Link onClick={() => {
          setWorkflowApprovalFormProps({ ...workflowApprovalFormProps, isOpen: true, readonly: true, workflowApproval: data.row });
         }}>{data.row.title}</Link>
      }
    },
    {
      key: 'latestProcessInstanceNode', name: '流程', resizable: true, renderCell: (data: any) => {
        return (
          <Popover withArrow>
            <PopoverTrigger disableButtonEnhancement>
              <Link onClick={() => { }}>{data.row.latestProcessInstanceNode}</Link>
            </PopoverTrigger>
            <PopoverSurface tabIndex={-1}>
              <ProcessInstanceViewer processDefinitionId={data.row.processDefinitionId} processInstanceId={data.row.processInstanceId} />
            </PopoverSurface>
          </Popover>
        )
      }
    },
    {
      key: 'latestProcessInstanceNode', name: '待处理节点', resizable: true, renderCell: (data: any) => {
        return (
          <Popover withArrow>
            <PopoverTrigger disableButtonEnhancement>
              <Link onClick={() => { }}>{data.row.latestProcessInstanceNode}</Link>
            </PopoverTrigger>
            <PopoverSurface tabIndex={-1}>
              <ProcessInstanceViewer processDefinitionId={data.row.processDefinitionId} processInstanceId={data.row.processInstanceId} />
            </PopoverSurface>
          </Popover>
        )
      }
    },
    {
      key: 'processInstanceState', name: '流程状态', width: 100, 
      renderHeaderCell: (props: any) => {
        return (
          <div style={{textAlign: 'center'}}>
            <span>{props.column.name}</span>
          </div>
        )
      },
      renderCell: (data: any) => {
        return (<div style={{textAlign: 'center'}}>
          {data.row.processInstanceState == ProcessInstanceState.COMPLETED && <Badge appearance="filled" color="success">已完成</Badge>}
          {data.row.processInstanceState == ProcessInstanceState.ACTIVE && <Badge appearance="filled" color="brand">进行中</Badge>}
          {data.row.processInstanceState == ProcessInstanceState.SUSPENDED && <Badge appearance="filled" color="informative">已挂起</Badge>}
          {data.row.processInstanceState == ProcessInstanceState.EXTERNALLY_TERMINATED && <Badge appearance="filled" color="warning">外部终止</Badge>}
          {data.row.processInstanceState == ProcessInstanceState.INTERNALLY_TERMINATED && <Badge appearance="filled" color="warning">内部终止</Badge>}
        </div>)
      }
    },
    {
      key: 'createdBy', name: '创建人'
    },
    {
      key: 'createdDate', name: '创建时间', renderCell: (data: any) => {
        return <span>{dayjs(data.row.createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    },
  ]);

  useEffect(() => {
    if (pageReuqest) {
      setIsLoading(true);
      getWorkflowApprovals(pageReuqest).then((data) => {
        pageReuqest.number == 0 ? setRows([...data.content]) : setRows([...rows, ...data.content]);
        setCurrentPage(data);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [pageReuqest]);

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    let isAtButtom = scrollTop + clientHeight >= scrollHeight;
    if (isLoading || !isAtButtom || currentPage?.last) return;

    setPageRequest({ number: pageReuqest.number + 1, size: pageReuqest.size });
  }, [pageReuqest, currentPage, isLoading]);

  return (
    <div className={styles.root}>
      <Toolbar size="small" className={styles.toolbar}>
        <Tooltip content="新建流程实例" relationship="description" withArrow>
          <ToolbarButton appearance="subtle" icon={workflowApprovalFormProps.isOpen ? <Dismiss20Regular /> : <Add20Regular />} onClick={() => {
            setWorkflowApprovalFormProps({ ...workflowApprovalFormProps, isOpen: !workflowApprovalFormProps.isOpen, readonly: false });
          }} />
        </Tooltip>
      </Toolbar>

      <WorkflowApprovalForm {...workflowApprovalFormProps}/>

      <div className={styles.dataGrid}>
        <DataGrid
          className="fill-grid rdg-light"
          style={{ height: "100%" }}
          columns={columns}
          rows={rows}
          rowHeight={30}
          rowKeyGetter={(r: any) => r.key}
          onRowsChange={setRows}
          onScroll={handleScroll}
        />
        {isLoading && <div className={styles.loadMore}><Spinner size="small" /></div>}

      </div>

    </div>
  )
}