import {
  makeStyles,
  tokens
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { NavMenu } from "../components/nav-menu.component";
import { Me, me } from "../services/auth.service";
import { GroupPage } from "./group.page";
import { UserPage } from "./user.page";
import { WorkflowPage } from "./worflow.page";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
  },
  nav: {
    flex: '0 0 auto',
    display: "flex",
    height: "100vh",
  },
  conatier: {
    flex: '1 1 auto',
    height: "100vh",
  },
  content: {
    height: "100vh",
    boxSizing: "border-box",
    padding: tokens.spacingHorizontalXS,
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
        <NavMenu me={currentUser} />
      </div>

      <div className={styles.conatier}>
        <div className={styles.content}>
          <Routes>
            <Route path="/workflows" element={<WorkflowPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/groups" element={<GroupPage />} />
            <Route path="*" element={<WorkflowPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}