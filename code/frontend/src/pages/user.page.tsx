import { GridReadyEvent, IDatasource } from '@ag-grid-community/core';
import { Toolbar, ToolbarButton, makeStyles, tokens } from "@fluentui/react-components";
import { AddCircle20Regular } from "@fluentui/react-icons";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useState } from "react";
import { users } from "../services/auth.service";
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
});

const PAGE_SIZE = 100;

export const UserPage = () => {
  const styles = useStyles();
  const [colDefs, setColDefs] = useState<any>([
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'username', headerName: '用户名', flex: 1 },
  ]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const dataSource: IDatasource = {
      rowCount: undefined,
      getRows: (params) => {
        users({number: params.startRow / PAGE_SIZE, size: PAGE_SIZE}).then((data) => {
          const rowsThisPage = data?.content;
          let lastRow = -1;
          if (data && data.totalElements <= params.endRow) {
            lastRow = data.totalElements;
          }
          params.successCallback(rowsThisPage as any[], lastRow);
        });
        // }, 500);
      },
    };
    params.api.setGridOption('datasource', dataSource);
  }, []);

  return (
    <div className={styles.page}>
      <Toolbar size="small" className={styles.toolbar}>
        <ToolbarButton appearance="primary" icon={<AddCircle20Regular />} />
      </Toolbar>

      <div className={styles.dataGrid}>
        <div
          className="ag-theme-quartz"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
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
  )
}