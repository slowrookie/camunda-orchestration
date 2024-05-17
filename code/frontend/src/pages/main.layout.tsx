import {
  makeStyles,
  shorthands,
  tokens
} from "@fluentui/react-components";
import { Route, Routes } from "react-router-dom";
import { NavMenu } from "../components/NavMenu";
import { UserPage } from "./user.page";
import { GroupPage } from "./group.page";
import { WorkflowPage } from "./worflow.page";

const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    display: "flex",
    height: "100vh",
  },
  nav: {
    flex: '0 0 auto',
    overflow: "hidden",
    display: "flex",
    height: "100vh",
  },
  content: {
    flex: '1 1 auto',
    display: "flex",
    height: "100vh",
    ...shorthands.padding(tokens.spacingHorizontalXS),
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});


export const MainLayout = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.nav}>
        <NavMenu />
      </div>

      <div className={styles.content}>
          <Routes>
            <Route path="/workflows" element={<WorkflowPage />} />
            <Route path="/users" element={<UserPage />}/>
            <Route path="/groups" element={<GroupPage />}/>
            <Route path="*" element={<div>404</div>} />
          </Routes>
      </div>
    </div>
  );
}