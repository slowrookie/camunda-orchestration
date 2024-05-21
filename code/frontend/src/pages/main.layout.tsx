import {
  makeStyles,
  shorthands,
  tokens
} from "@fluentui/react-components";
import { Route, Routes } from "react-router-dom";
import { NavMenu } from "../components/nav-menu.component";
import { UserPage } from "./user.page";
import { GroupPage } from "./group.page";
import { WorkflowPage } from "./worflow.page";
import { useEffect, useState } from "react";
import { Me, me } from "../services/auth.service";

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
    height: "100vh",
    ...shorthands.padding(tokens.spacingHorizontalXS),
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});


export const MainLayout = () => {
  const styles = useStyles();
  const [currentUser, setCurrentUser] = useState<Me>();

  useEffect(() => {
    me().then((data: Me) => {
      setCurrentUser(data);
    });
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.nav}>
        <NavMenu me={currentUser}/>
      </div>

      <div className={styles.content}>
          <Routes>
            <Route path="/workflows" element={<WorkflowPage />} />
            <Route path="/users" element={<UserPage />}/>
            <Route path="/groups" element={<GroupPage />}/>
            <Route path="*" element={<WorkflowPage />} />
          </Routes>
      </div>
    </div>
  );
}