import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Dropdown,
  Field,
  Input,
  Link,
  Option,
  OverlayDrawer,
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
import { Add20Regular, Dismiss20Regular, Play20Regular } from '@fluentui/react-icons';
import { Form } from "@rjsf/fluentui-rc";
import validator from '@rjsf/validator-ajv8';
import { UIEvent, useCallback, useEffect, useState } from 'react';
import type { Column } from 'react-data-grid';
import DataGrid from 'react-data-grid';
import { useMe } from '../context/MeContexnt';
import { Page } from '../services/api.service';
import { FormDef, FormDefDetail, getFormDefDetailLatest } from '../services/form.service';
import { WorkflowApproval, getWorkflowApprovals, startWorkflowApproval } from '../services/workflow-approval.service';
import { processDefinitionStatisticsGrouped } from '../services/workflow.service';
import { ProcessInstanceViewer } from '../components/process/process-instance-viewer.component';

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

export const WorkflowApprovalPage = () => {
  const styles = useStyles();
  const me = useMe();

  // create
  const [isOpen, setIsOpen] = useState(false);
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
        return <Link onClick={() => { }}>{data.row.title}</Link>
      }
    },
    {
      key: 'latestProcessInstanceNode', name: '当前节点', resizable: true, renderCell: (data: any) => {
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
      key: 'operationTime', name: '操作时间'
    },
    {
      key: 'createdBy', name: '创建人'
    },
    {
      key: 'createdDate', name: '创建时间'
    },
  ]);
  // form
  const [formDefDetails, setFormDefDetails] = useState<FormDefDetail[]>([]);
  const [selectedFormDefDetail, setSelectedFormDefDetail] = useState<FormDefDetail>({ id: '', key: '', name: '', schemas: '', enable: true });
  const [formData, setFormData] = useState<any>({});
  // process definintion
  const [processDefinitions, setProcessDefinitions] = useState<any[]>([]);
  const [selectedProcessDefinition, setSelectedProcessDefinition] = useState<any>({id: "", name: ""});
  // workflow approval
  const [selectedWorkflowApproval, setSelectedWorkflowApproval] = useState<WorkflowApproval>({id: '', title: ''});
  const [inProcess, setInProcess] = useState(false);
  const [formErros, setFormErrors] = useState<any>({});

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

  useEffect(() => {
    if (isOpen) {
      getFormDefDetailLatest().then((data) => {
        setFormDefDetails(data);
      });
      processDefinitionStatisticsGrouped().then((rows) => {
        setProcessDefinitions(rows);
      });
    }
  }, [isOpen]);

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    let isAtButtom = scrollTop + clientHeight >= scrollHeight;
    if (isLoading || !isAtButtom || currentPage?.last) return;

    setPageRequest({ number: pageReuqest.number + 1, size: pageReuqest.size });
  }, [pageReuqest, currentPage, isLoading]);


  useEffect(() => {
    if (me) {
      setFormData({userId: me.id, username: me.username})
    }
  }, [me]);

  const createForm = useCallback(() => {
    if (!selectedFormDefDetail || !selectedFormDefDetail.schemas) return;
    const schema = JSON.parse(selectedFormDefDetail.schemas);
    return <Form
            // className={styles.form}
            schema={schema.Schema}
            validator={validator}
            uiSchema={schema.UISchema}
            formData={formData}
            onChange={(data) => {
              setFormData(data.formData)
            }}
            transformErrors={(errors) => {
              setFormErrors(errors);
              return errors.map((error) => {
                if (error.name === 'required') {
                  if (error.property) {
                    const schemaProperty = schema.Schema.properties[error.property];
                    if (schemaProperty) {
                      error.message = `${schemaProperty.title}是必填项`;
                    }
                  }
                }
                return error;
              });
            }}
            liveValidate
            showErrorList={false}
            />
  }, [selectedFormDefDetail, formData]);

  const handleStart = () => {
    setInProcess(true);
    selectedWorkflowApproval.formData = formData;
    console.log(selectedWorkflowApproval);
    startWorkflowApproval(selectedWorkflowApproval)
    .then(() => {
      setIsOpen(false);
      setPageRequest({ number: 0, size: PAGE_SIZE });
    })
    .finally(() => {
      setInProcess(false);
    });
  }

  return (
    <div className={styles.root}>
      <Toolbar size="small" className={styles.toolbar}>
        <Tooltip content="新建流程实例" relationship="description" withArrow>
          <ToolbarButton appearance="subtle" icon={isOpen ? <Dismiss20Regular /> : <Add20Regular />} onClick={() => {
            setIsOpen(!isOpen);
          }} />
        </Tooltip>
      </Toolbar>

      <OverlayDrawer
        className={styles.drawer}
        modalType="non-modal"
        size='medium'
        open={isOpen}
        position='end'
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle action={
            <Button appearance="subtle" aria-label="Close" size='small' icon={<Dismiss20Regular />} onClick={() => setIsOpen(false)} />
          }>
            开始流程
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody className={styles.drawerBody}>
          <Field label="标题" required validationMessage={selectedWorkflowApproval.title.length > 1 ? undefined : '标题是必填项'}>
            <Input id="title" required value={selectedProcessDefinition.title} onChange={(_, v) => {
              setSelectedWorkflowApproval({ ...selectedWorkflowApproval, title: v.value});
            }} />
          </Field>

          <Field label={"表单"} required validationMessage={selectedFormDefDetail.id ? undefined : '表单是必填项' }>
            <Dropdown placeholder="表单" value={selectedFormDefDetail.name} selectedOptions={[(selectedFormDefDetail.id)]} onOptionSelect={(_, v) => {
              if (v.optionValue) {
                const selected = formDefDetails.find((d) => d.id == v.optionValue);
                selected && setSelectedFormDefDetail(selected);
                setSelectedWorkflowApproval({ ...selectedWorkflowApproval, formDefDetailId: v.optionValue});
              }
             }}>
              {formDefDetails && formDefDetails.map((option: FormDefDetail) => (
                <Option key={option.id} value={option.id} text={option.name}>
                  {option.name}
                </Option>
              ))}
            </Dropdown>
          </Field>

          {createForm()}

          <Field label={"流程"} required validationMessage={selectedProcessDefinition.id ? undefined : '流程是必填项'}>
            <Dropdown placeholder="流程" value={selectedProcessDefinition.name} selectedOptions={[(selectedProcessDefinition.id)]} onOptionSelect={(_, v) => {
              if (v.optionValue) {
                const selected = processDefinitions.find((d) => d.id == v.optionValue);
                selected && setSelectedProcessDefinition(selected);
                setSelectedWorkflowApproval({ ...selectedWorkflowApproval, processDefinitionId: v.optionValue});
              }
             }}>
              {processDefinitions && processDefinitions.map((option: any) => (
                <Option key={option.id} value={option.id} text={option.name}>
                  {option.name} - {option.key}
                </Option>
              ))}
            </Dropdown>
          </Field>

        </DrawerBody>
        <DrawerFooter className={styles.drawerFooter}>
          <ToolbarButton appearance='primary' 
              icon={<>{inProcess ? <Spinner size='tiny' /> : <Play20Regular />}</>}
              disabled={inProcess || !selectedWorkflowApproval.title || !selectedWorkflowApproval.formDefDetailId 
                || !selectedWorkflowApproval.processDefinitionId || formErros.length}
              onClick={handleStart}
            >开始</ToolbarButton>
        </DrawerFooter>
      </OverlayDrawer>

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