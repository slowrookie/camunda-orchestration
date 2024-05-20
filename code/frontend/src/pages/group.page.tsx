import { GridReadyEvent, IDatasource } from '@ag-grid-community/core';
import { Button, DrawerBody, DrawerHeader, DrawerHeaderTitle, Dropdown, Input, Label, Option, OptionOnSelectData, OverlayDrawer, Persona, Toolbar, ToolbarButton, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { Add20Regular, Dismiss20Regular, Edit20Filled } from '@fluentui/react-icons';
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Group, User, createGroup, getUsers, groups } from "../services/auth.service";
import { localeTextCn } from "../utils/ag-grid.local";

const useStyles = makeStyles({
  page: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: tokens.spacingHorizontalXS,
  },
  toolbar: {
    // padding: tokens.spacingHorizontalXS,
  },
  dataGrid: {
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    paddingTop: tokens.spacingHorizontalXS,
    flex: "1 1 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  formField: {
    display: "grid",
    gridRowGap: tokens.spacingVerticalXS,
    marginTop: tokens.spacingVerticalMNudge,
    ...shorthands.padding(tokens.spacingHorizontalMNudge),
  }
});

const PAGE_SIZE = 100;

export const GroupPage = () => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [group, setGroup] = useState<Group>({id: '', name: '', users: [] });

  const gridRef = useRef<AgGridReact>(null);
  const [colDefs, setColDefs] = useState<any>([
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: '组名', flex: 1 },
    { field: 'id', headerName: '操作', cellRenderer: (row: any) => {
      return <Button icon={<Edit20Filled />} size="small" onClick={() => {
        setGroup(row.data);
        setIsOpen(true);
      }} />
    }}
  ]);

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    getUsers({ number: 0, size: 100 }).then((data) => {
      setUsers(data.content);
    });
  }, []);

  const handleUserOptionSelect = (_: any, data: OptionOnSelectData) => {
    const u = users.find(u => u.id === data.optionValue);
    if (u) {
      setGroup({ ...group, users: [...(group.users || []), u] });
    }
  }

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const dataSource: IDatasource = {
      rowCount: undefined,
      getRows: (params) => {
        groups({ number: params.startRow / PAGE_SIZE, size: PAGE_SIZE }).then((data) => {
          const rowsThisPage = data?.content;
          let lastRow = -1;
          if (data && data.totalElements <= params.endRow) {
            lastRow = data.totalElements;
          }
          params.successCallback(rowsThisPage as any[], lastRow);
        });
      },
    };
    params.api.setGridOption('datasource', dataSource);
  }, []);

  const groupCreate = () => {
    return (
      <OverlayDrawer
        modalType="non-modal"
        open={isOpen}
        position='end'
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle action={
            <Button appearance="subtle" aria-label="Close" size='small' icon={<Dismiss20Regular />} 
            onClick={() => {
              setIsOpen(false);
              setGroup({ id: '', name: '', users: []});
            }} />
          }>
            {group.id ? '编辑': '创建'}组
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <div className={styles.formField}>
            <Label htmlFor={"groupname"}>组名</Label>
            <Input id="groupname" required value={group.name}
              onChange={(_, v) => { setGroup({ ...group, name: v.value }) }}
            />
          </div>
          <div className={styles.formField}>
            <label id={'users'}>用户</label>
            <Dropdown aria-labelledby={"用户"} multiselect={true} 
              // defaultSelectedOptions={group.users?.map(u => u.id+"")}  
              defaultValue={group.users?.map(u => `${u.username}`).join(",")}
              selectedOptions={group.users?.map(u => `${u.id}`)}
              onOptionSelect={handleUserOptionSelect}
            >
              {users.map((u) => {
                return <Option key={u.id} text={u.username} value={u.id}>
                  <Persona
                    size='small'
                    avatar={{ color: "colorful"}}
                    name={u.username}
                    presence={{
                      status: "available",
                    }}
                  />
                </Option>
              })}
            </Dropdown>

          </div>
          <div className={styles.formField}>
            <Button appearance="primary" onClick={() => {
              createGroup(group).then(() => {
                setIsOpen(false);
                setGroup({ id: '', name: '', users: []});
                gridRef.current?.api?.purgeInfiniteCache();
              });
            }}>{group.id ? '编辑': '创建'}</Button>
          </div>
        </DrawerBody>
      </OverlayDrawer>
    );
  }

  return (<>
    <div className={styles.page}>
      <Toolbar size="small" className={styles.toolbar}>
        <ToolbarButton appearance="primary" icon={isOpen ? <Dismiss20Regular /> : <Add20Regular />} onClick={() => { setIsOpen(!isOpen) }} />
        {groupCreate()}
      </Toolbar>

      <div className={styles.dataGrid}>
        <div
          className="ag-theme-quartz"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            ref={gridRef}
            localeText={localeTextCn}
            columnDefs={colDefs}
            rowBuffer={0}
            rowModelType={'infinite'}
            cacheBlockSize={PAGE_SIZE}
            cacheOverflowSize={2}
            maxConcurrentDatasourceRequests={1}
            infiniteInitialRowCount={1}
            maxBlocksInCache={100}
            onGridReady={onGridReady as any}
          />
        </div>

      </div>

    </div>
  </>
  )
}