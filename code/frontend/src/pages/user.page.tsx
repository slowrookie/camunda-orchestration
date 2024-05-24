import { GridReadyEvent, IDatasource } from '@ag-grid-community/core';
import { Button, DrawerBody, DrawerHeader, DrawerHeaderTitle, Input, Label, OverlayDrawer, Toolbar, ToolbarButton, makeStyles, tokens, shorthands } from "@fluentui/react-components";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useRef, useState } from "react";
import { User, createUser, getUsers } from "../services/auth.service";
import { localeTextCn } from "../utils/ag-grid.local";
import { Dismiss20Regular, Add20Regular } from '@fluentui/react-icons';

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

export const UserPage = () => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User>({id: '', password: '', username: ''});

  const gridRef = useRef<AgGridReact>(null);
  const [colDefs, _] = useState<any>([
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'username', headerName: '用户名', flex: 1 },
  ]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const dataSource: IDatasource = {
      rowCount: undefined,
      getRows: (params) => {
        getUsers({ number: params.startRow / PAGE_SIZE, size: PAGE_SIZE }).then((data) => {
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

  const userCreate = () => {
    return (
      <OverlayDrawer
        modalType="non-modal"
        open={isOpen}
        position='end'
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle action={
            <Button appearance="subtle" aria-label="Close" size='small' icon={<Dismiss20Regular />} onClick={() => setIsOpen(false)} />
          }>
            创建用户
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <div className={styles.formField}>
            <Label htmlFor={"username"}>用户名</Label>
            <Input id="username" required value={user.username} 
              onChange={(_, v) => { setUser({ ...user, username: v.value }) }}
            />
          </div>
          <div className={styles.formField}>
            <Label htmlFor={"password"}>密码</Label>
            <Input id="password" type="password" required value={user.password} 
              onChange={(_, v) => { setUser({ ...user, password: v.value }) }}
            />
          </div>
          <div className={styles.formField}>
            <Button appearance="primary" onClick={() => {
              createUser(user).then(() => {
                setIsOpen(false);
                gridRef.current?.api?.purgeInfiniteCache();
              });
            }}>创建</Button>
          </div>
        </DrawerBody>
      </OverlayDrawer>
    );
  }

  return (<>
    <div className={styles.page}>
      <Toolbar size="small" className={styles.toolbar}>
        <ToolbarButton appearance="primary" icon={isOpen ? <Dismiss20Regular /> : <Add20Regular />} onClick={() => { setIsOpen(!isOpen) }} />
        {userCreate()}
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