import {
  DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderNavigation,
  DrawerHeaderTitle, Dropdown, Field, Input, Link, Menu,
  MenuTrigger, Option, OptionOnSelectData, OverlayDrawer, PresenceBadge, SelectionEvents, Spinner,
  Subtitle2,
  Toast,
  ToastBody, ToastTitle, Toaster, Toolbar, ToolbarButton, ToolbarDivider,
  makeStyles, shorthands, tokens, useId, useToastController
} from '@fluentui/react-components';
import { Add20Regular, ArrowExport24Filled, Dismiss20Regular, Dismiss24Regular, Rocket24Filled, Rocket24Regular, bundleIcon } from '@fluentui/react-icons';
import { MouseEvent, UIEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { Column } from 'react-data-grid';
import DataGrid from 'react-data-grid';
import { FormDesigner } from '../components/form/form-designer.component';
import { Page } from '../services/api.service';
import { FormDef, FormDefDetail, createOrModifyFormDef, getFormDefs } from '../services/form.service';
import { generateId } from '../utils/generate-id.util';

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
    // padding: tokens.spacingHorizontalXS,
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
  formDesignerToolbar: {
    // justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
  },
  formDesignerHead: {
    padding: tokens.spacingVerticalM,
  },
  formDesignerBody: {
    padding: 0,
    borderTop: '1px solid #ccc',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    boxSizing: 'border-box',
    ...shorthands.padding(tokens.spacingVerticalNone),
  },
  formDesignerFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: tokens.spacingVerticalM,
    borderTop: '1px solid #ccc',
  }
});

const PAGE_SIZE = 100;

export const FormPage = () => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const toasterId = useId("formDesignerToaster");
  const { dispatchToast } = useToastController(toasterId);

  // grid data
  const [selectedFormDefDetail, setSelectedFormDefDetail] = useState<FormDefDetail>({ id: '', key: '', name: '', schemas: '', enable: true });
  const [selectedFormDefDetails, setSelectedFormDefDetails] = useState<FormDefDetail[]>([]);
  const [pageReuqest, setPageRequest] = useState({ number: 0, size: PAGE_SIZE });
  const [currentPage, setCurrentPage] = useState<Page<FormDef>>();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const columns: readonly Column<FormDef>[] = ([
    {
      key: 'id', name: '表单ID', resizable: true, renderCell: (data: any) => {
        return <Link onClick={() => handleEdit(data.row)}>{data.row.id}</Link>
      }
    },
    {
      key: 'key', name: '表单Key', resizable: true, renderCell: (data: any) => {
        return <Link onClick={() => handleEdit(data.row)}>{data.row.key}</Link>
      }
    },
    { key: 'name', name: '表单名称', resizable: true, renderCell: (data: any) => {
      return data.row.formDefDetails && data.row?.formDefDetails[0]?.name;
    }},
    { key: 'rev', name: '版本', width: 50, resizable: true },
    {
      key: 'status', name: '状态', width: 50, cellClass: styles.dataGridCellAlignCenter,
      renderCell: (data: any) => {
        return <PresenceBadge size='large' style={{ padding: 5 }} status={data.row.suspended ? 'do-not-disturb' : 'available'} />
      }
    },
  ]);


  useEffect(() => {
    if (pageReuqest) {
      setIsLoading(true);
      getFormDefs(pageReuqest).then((data) => {
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


  let handleSave = (event: MouseEvent) => {
    event.preventDefault();
    setDeploying(true);
    createOrModifyFormDef(selectedFormDefDetail).then(() => {
      setPageRequest({ number: 0, size: PAGE_SIZE });
      dispatchToast(
        <Toast>
          <ToastTitle>{selectedFormDefDetail.formDefId ? '编辑' : '创建'}成功</ToastTitle>
        </Toast>,
        { intent: "success", position: "top-end" }
      )
    }).catch((err: any) => {
      dispatchToast(
        <Toast>
          <ToastTitle>{selectedFormDefDetail.formDefId ? '编辑' : '创建'}失败</ToastTitle>
          <ToastBody>{err?.response?.data?.message}</ToastBody>
        </Toast>,
        { intent: "error", position: "top-end" }
      )
    }).finally(() => {
      setDeploying(false);
      setIsOpen(false);
    });
  }

  const handleCreate = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
    setSelectedFormDefDetail({...selectedFormDefDetail, key: `form-${generateId()}`});
  }

  const handleEdit = (row: FormDef) => {
    const selected = {...row.formDefDetails[0], formDefId: row.id};
    setSelectedFormDefDetail(selected);
    setSelectedFormDefDetails(row.formDefDetails);
    setIsOpen(true);
  };

  const handleChangeVersion = (_: SelectionEvents, data: OptionOnSelectData) => {
    let selected = selectedFormDefDetails.find((d) => d.id == data.optionValue);
    selected = {...selectedFormDefDetail, ...selected}
    selected && setSelectedFormDefDetail(selected);
  }

  const formDeisgnerDrawer = useMemo(() => {
    return (<>
      <OverlayDrawer
        className={styles.drawer}
        modalType="non-modal"
        size='full'
        open={isOpen}
        position='end'
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader className={styles.formDesignerHead}>
          <DrawerHeaderNavigation>
            <Toolbar className={styles.formDesignerToolbar}>
              <DrawerHeaderTitle>表单设计</DrawerHeaderTitle>

              <Field required style={{ paddingLeft: tokens.spacingHorizontalS }}>
                <Input placeholder='名称'
                  contentBefore={
                    <Subtitle2>
                      {selectedFormDefDetail.key}
                    </Subtitle2>
                  }
                  value={selectedFormDefDetail.name}
                  onChange={(_, v) => setSelectedFormDefDetail({ ...selectedFormDefDetail, name: v.value })} />
              </Field>

              <Field>
                <Dropdown placeholder="版本" value={selectedFormDefDetail.version} selectedOptions={[selectedFormDefDetail.id]} onOptionSelect={handleChangeVersion}>
                  {selectedFormDefDetails && selectedFormDefDetails.map((option) => (
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
              </Menu>
              <ToolbarButton appearance="subtle" icon={<Dismiss24Regular />} onClick={() => setIsOpen(false)} />
            </Toolbar>
          </DrawerHeaderNavigation>
        </DrawerHeader>
        <DrawerBody className={styles.formDesignerBody}>
          <FormDesigner schemaString={selectedFormDefDetail.schemas} onChange={(schema) => {
            setSelectedFormDefDetail({ ...selectedFormDefDetail, schemas: JSON.stringify(schema) });
          }} />
        </DrawerBody>
        <DrawerFooter className={styles.formDesignerFooter}>
          <Toolbar>
            <ToolbarButton appearance='primary' icon={<>{deploying ? <Spinner size='tiny' /> : <DeployIcon />}</>}
              disabled={deploying}
              onClick={handleSave}
            >{selectedFormDefDetail.id ? '修订' : '创建'}</ToolbarButton>
          </Toolbar>
        </DrawerFooter>
      </OverlayDrawer>
    </>)
  }, [selectedFormDefDetail, selectedFormDefDetails, isOpen, deploying]);

  return (
    <div className={styles.root}>
      <Toaster toasterId={toasterId} />
      <Toolbar size="small" className={styles.toolbar}>
        <ToolbarButton appearance="primary" icon={isOpen ? <Dismiss20Regular /> : <Add20Regular />} onClick={handleCreate} />
        {formDeisgnerDrawer}
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
          onScroll={handleScroll}
        />
        {isLoading && <div className={styles.loadMore}><Spinner size="small" /></div>}

      </div>

    </div>
  )
}