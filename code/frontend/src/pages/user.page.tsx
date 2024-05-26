import { Button, DrawerBody, DrawerHeader, DrawerHeaderTitle, Input, Label, OverlayDrawer, Spinner, Toolbar, ToolbarButton, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { Add20Regular, Dismiss20Regular } from '@fluentui/react-icons';
import { UIEvent, useCallback, useEffect, useState } from "react";
import type { Column } from 'react-data-grid';
import DataGrid from 'react-data-grid';
import { Page } from '../services/api.service';
import { User, createUser, getUsers } from "../services/auth.service";

const useStyles = makeStyles({
  page: {
    width: "100%",
    height: "100%",
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
  loadMore: {
    paddingBlock: "8px",
    paddingInline: "16px",
    position: "absolute",
    insetBlockEnd: "8px",
    insetInlineEnd: "8px",
    lineHeight: "35px",
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

const columns: readonly Column<User>[] = [
  { key: 'id', name: 'ID', resizable: true },
  { key: 'username', name: '用户名', resizable: true },
];

export const UserPage = () => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User>({ id: '', password: '', username: '' });
  const [rows, setRows] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<Page<User>>();
  const [pageReuqest, setPageRequest] = useState({ number: 0, size: PAGE_SIZE });
  const [isLoading, setIsLoading] = useState(false);

  function rowKeyGetter(row: User) {
    return row.id;
  }

  useEffect(() => {
    if (pageReuqest) {
      setIsLoading(true);
      getUsers(pageReuqest).then((data) => {
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
            {user.id ? '编辑': '创建'}用户
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
            <Input id="password" required value={user.password}
              onChange={(_, v) => { setUser({ ...user, password: v.value }) }}
            />
          </div>
          <div className={styles.formField}>
            <Button appearance="primary" onClick={() => {
              createUser(user).then(() => {
                setIsOpen(false);
                setUser({ id: '', password: '', username: '' });
                setPageRequest({ number: 0, size: PAGE_SIZE });
              });
            }}>{user.id ? '编辑': '创建'}用户</Button>
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
        <DataGrid
          className="fill-grid rdg-light"
          style={{height: "100%"}}
          columns={columns}
          rows={rows}
          rowHeight={30}
          rowKeyGetter={rowKeyGetter}
          onRowsChange={setRows}
          onScroll={handleScroll}
        />
        {isLoading && <div className={styles.loadMore}><Spinner size="small" /></div>}
      </div>

    </div>
  </>
  )
}