import {
  DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderNavigation,
  DrawerHeaderTitle, Dropdown, Field, Link, Menu, MenuItem, MenuList, MenuPopover,
  MenuTrigger, Option, OptionOnSelectData, OverlayDrawer, PresenceBadge, SelectionEvents, Spinner, Toast,
  ToastBody, ToastTitle, Toaster, Toolbar, ToolbarButton, ToolbarDivider,
  Tooltip,
  makeStyles, tokens, useId, useToastController
} from '@fluentui/react-components';
import { Add20Regular, ArrowExport24Filled, Dismiss20Regular, Dismiss24Regular, Rocket24Filled, Rocket24Regular, bundleIcon } from '@fluentui/react-icons';
import { useRef } from 'preact/hooks';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import type { Column } from 'react-data-grid';
import DataGrid from 'react-data-grid';
import { BpmnDesigner, IBpmnDesigerRef, TEMPLATE_EMPTY } from '../components/bpmn/bpmn-designer.component';
import { deploymentCreate, processDefinitionStatisticsGrouped, processDefinitionXmlById } from '../services/workflow.service';

const DeployIcon = bundleIcon(Rocket24Filled, Rocket24Regular);

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: tokens.spacingHorizontalXS,
  },
  drawer: {
    transitionDuration: '0s',
  },
  toolbar: {

  },
  dataGrid: {
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    paddingTop: tokens.spacingHorizontalXS,
    flex: "1 1 auto",
  },
  dataGridCellAlignCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMore: {
    paddingBlock: "8px",
    paddingInline: "16px",
    position: "absolute",
    insetBlockEnd: "8px",
    insetInlineEnd: "8px",
    lineHeight: "35px",
  },
  bpmnDesignerToolbar: {
    gap: tokens.spacingHorizontalS,
  },
  bpmnDesignerHead: {
    padding: tokens.spacingVerticalM,
  },
  bpmnDesignerBody: {
    padding: 0,
    borderTop: '1px solid #ccc',
  },
  bpmnDesignerFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: tokens.spacingVerticalM,
    borderTop: '1px solid #ccc',
  }
});

const donwloadFile = (data: string, mimeType: string, fileName: string) => {
  var element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(data)}`);
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export const WorkflowPage = () => {
  const styles = useStyles();
  const designerRef = useRef<IBpmnDesigerRef>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const toasterId = useId("bpmnDesignerToaster");
  const { dispatchToast } = useToastController(toasterId);
  const [diagramXml, setDiagramXml] = useState<string>('');
  const [setlectedRow, setSelectedRow] = useState<any>({});
  const [selectedProcessDefinition, setSelectedProcessDefinition] = useState<any>({ version: "" });

  // export xml
  let handleDownloadXml = (event: MouseEvent) => {
    event.preventDefault();
    designerRef.current?.saveXML().then((result: any) => {
      if (!result) {
        return;
      }
      donwloadFile(result.xml, 'text/plain', 'diagram.bpmn');
    });
  }

  // // export svg
  let handleDownloadSvg = (event: MouseEvent) => {
    event.preventDefault();
    designerRef.current?.saveSVG().then((result: any) => {
      if (!result) {
        return;
      }
      donwloadFile(result.svg, 'image/svg+xml', 'diagram.svg');
    });
  }

  // deploy
  let handleDeploy = (event: MouseEvent) => {
    event.preventDefault();
    setDeploying(true);
    designerRef.current?.saveXML().then((result: any) => {
      if (!result) {
        return;
      }
      return deploymentCreate(result.xml);
    }).then(() => {
      loadData();
      dispatchToast(
        <Toast>
          <ToastTitle>部署成功</ToastTitle>
        </Toast>,
        { intent: "success", position: "top-end" }
      )
    }).catch((err: any) => {
      dispatchToast(
        <Toast>
          <ToastTitle>部署失败</ToastTitle>
          <ToastBody>{err?.response?.data?.message}</ToastBody>
        </Toast>,
        { intent: "error", position: "top-end" }
      )
    }).finally(() => {
      setDeploying(false);
    });
  }

  const bpmnDesigner = useMemo(() => {
    return <BpmnDesigner ref={designerRef} diagramXml={diagramXml} />;
  }, [designerRef, diagramXml]);

  const handleCreate = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
    setDiagramXml(TEMPLATE_EMPTY);
  }

  // grid data
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const columns: readonly Column<any>[] = ([
    {
      key: 'key', name: '流程ID', resizable: true, renderCell: (data: any) => {
        return <Link onClick={() => handleEdit(data.row)}>{data.row.key}</Link>
      }
    },
    { key: 'name', name: '流程名称', resizable: true },
    { key: 'incidents', name: '事件', width: 80, resizable: true },
    { key: 'instances', name: '运行实例', width: 80, resizable: true },
    {
      key: 'version', name: '版本', width: 50, resizable: true, renderCell: (data: any) => {
        return <Link onClick={() => handleEdit(data.row)}>{data.row.version}</Link>
      }
    },
    { key: 'versionTag', name: '版本标签', width: 200, resizable: true },
    {
      key: 'suspended', name: '状态', width: 50, cellClass: styles.dataGridCellAlignCenter,
      renderCell: (data: any) => {
        return <PresenceBadge size='large' style={{ padding: 5 }} status={data.row.suspended ? 'do-not-disturb' : 'available'} />
      }
    },
  ]);

  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setSelectedProcessDefinition(row.definitions[row.definitions.length - 1]);
    changeVersion(row.id);
  };

  const changeVersion = (id: string) => {
    processDefinitionXmlById(id)
      .then((data) => {
        setIsOpen(true);
        setDiagramXml(data.bpmn20Xml);
      })
  }

  const loadData = () => {
    setIsLoading(true);
    processDefinitionStatisticsGrouped().then((rows) => {
      setRows(rows);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className={styles.root}>
      <Toaster toasterId={toasterId} />
      <Toolbar size="small" className={styles.toolbar}>
        <Tooltip content="创建" relationship="description">
          <ToolbarButton appearance="subtle" icon={isOpen ? <Dismiss20Regular /> : <Add20Regular />} onClick={handleCreate} />
        </Tooltip>
        <OverlayDrawer
          className={styles.drawer}
          modalType="non-modal"
          size='full'
          open={isOpen}
          position='end'
          onOpenChange={(_, { open }) => setIsOpen(open)}
        >
          <DrawerHeader className={styles.bpmnDesignerHead}>
            <DrawerHeaderNavigation>
              <Toolbar className={styles.bpmnDesignerToolbar}>
                <DrawerHeaderTitle>流程设计</DrawerHeaderTitle>

                <Field>
                  <Dropdown placeholder="版本" value={selectedProcessDefinition.version} selectedOptions={[selectedProcessDefinition.id]} onOptionSelect={(_: SelectionEvents, data: OptionOnSelectData) => {
                    let selected = setlectedRow.definitions.find((d: any) => d.id == data.optionValue);
                    setSelectedProcessDefinition(selected);
                    console.log(selected);
                    changeVersion(selected.id);
                  }}>
                    {setlectedRow.definitions && setlectedRow.definitions.map((option: any) => (
                      <Option key={option.id} value={option.id} text={option.version || ''}>
                        {option.version}
                      </Option>
                    ))}
                  </Dropdown>
                </Field>

                <div style={{ flex: '1' }}></div>
                <ToolbarDivider />
                <Menu>
                  <MenuTrigger>
                    <ToolbarButton aria-label="" icon={<ArrowExport24Filled />}>导出</ToolbarButton>
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      <MenuItem onClick={handleDownloadXml}>XML</MenuItem>
                      <MenuItem onClick={handleDownloadSvg}>SVG</MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>
                <ToolbarDivider />
                <ToolbarButton appearance="subtle" icon={<Dismiss24Regular />} onClick={() => setIsOpen(false)} />
              </Toolbar>
            </DrawerHeaderNavigation>
          </DrawerHeader>
          <DrawerBody className={styles.bpmnDesignerBody}>
            {/* <BpmnDesigner ref={designerRef} /> */}
            {bpmnDesigner}
          </DrawerBody>
          <DrawerFooter className={styles.bpmnDesignerFooter}>
            <Toolbar>
              <ToolbarButton appearance='primary' icon={<>{deploying ? <Spinner size='tiny' /> : <DeployIcon />}</>}
                disabled={deploying}
                onClick={handleDeploy}
              >部署</ToolbarButton>
            </Toolbar>
          </DrawerFooter>
        </OverlayDrawer>
      </Toolbar>

      <div className={styles.dataGrid}>
        <DataGrid
          className="fill-grid rdg-light"
          style={{ height: "100%" }}
          columns={columns}
          rows={rows}
          rowHeight={30}
          rowKeyGetter={(r: any) => r.key}
          onRowsChange={setRows}
        />
        {isLoading && <div className={styles.loadMore}><Spinner size="small" /></div>}

      </div>

    </div>
  )
}