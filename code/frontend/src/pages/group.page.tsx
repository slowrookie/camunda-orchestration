import { Button, DrawerBody, DrawerHeader, DrawerHeaderTitle, Dropdown, Input, Label, Option, OptionOnSelectData, OverlayDrawer, Persona, Spinner, Toolbar, ToolbarButton, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { Add20Regular, Dismiss20Regular, Edit20Filled } from '@fluentui/react-icons';
import { UIEvent, useCallback, useEffect, useState } from "react";
import type { Column } from 'react-data-grid';
import DataGrid from 'react-data-grid';
import { Page } from '../services/api.service';
import { Group, User, createGroup, getGroups, getUsers } from "../services/auth.service";

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

export const GroupPage = () => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [group, setGroup] = useState<Group>({id: '', name: '', users: [] });
  const [rows, setRows] = useState<Group[]>([]);
  const [currentPage, setCurrentPage] = useState<Page<Group>>();
  const [pageReuqest, setPageRequest] = useState({ number: 0, size: PAGE_SIZE });
  const [isLoading, setIsLoading] = useState(false);

  function rowKeyGetter(row: Group) {
    return row.id;
  }

  useEffect(() => {
    if (pageReuqest) {
      setIsLoading(true);
      getGroups(pageReuqest).then((data) => {
        pageReuqest.number == 0 ? setRows([...data.content]) : setRows([...rows, ...data.content]);
        setCurrentPage(data);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [pageReuqest]);

  const columns: readonly Column<Group>[] = ([
    { key: 'id', name: 'ID', resizable: true },
    { key: 'name', name: '组名', resizable: true },
    { key: '', name: '操作', renderCell: (data: any) => {
      return <Button id={`edit-${data.row.id}`} icon={<Edit20Filled />} size="small" onClick={() => {
        setGroup(data.row);
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
    const us = users.filter(u => data.selectedOptions.includes(u.id));
    setGroup({ ...group, users: us });
  }

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    let isAtButtom = scrollTop + clientHeight >= scrollHeight;
    if (isLoading || !isAtButtom || currentPage?.last) return;

    setPageRequest({ number: pageReuqest.number + 1, size: pageReuqest.size });
  }, [pageReuqest, currentPage, isLoading]);

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
                setPageRequest({ number: 0, size: PAGE_SIZE });
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