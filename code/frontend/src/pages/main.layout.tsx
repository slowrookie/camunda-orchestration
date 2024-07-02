import {
  makeStyles,
  tokens
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { NavMenu } from "../components/nav-menu.component";
import { MeProvider } from "../context/MeContexnt";
import { Me, me } from "../services/auth.service";
import { DashboardPage } from "./dashboard.page";
import { FormPage } from "./form.page";
import { GroupPage } from "./group.page";
import { UserPage } from "./user.page";
import { WorkflowPage } from "./worflow.page";
import { WorkflowApprovalPendingPage } from "./workflow-approval-pending.page";
import { WorkflowApprovalSubmittedPage } from "./workflow-approval-submitted.page";

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
  const [currentUser, setCurrentUser] = useState<Me>({id: "", username: ""});

  useEffect(() => {
    me().then((data: Me) => {
      setCurrentUser(data);
    });
  }, []);

  return (
    <MeProvider value={currentUser}>
      <div className={styles.root}>
        <div className={styles.nav}>
          <NavMenu me={currentUser} />
        </div>

        <div className={styles.conatier}>
          <div className={styles.content}>
            <Routes>
              <Route path="/workflows" element={<WorkflowPage />} />
              <Route path="/workflow/approval/submitted" element={<WorkflowApprovalSubmittedPage />} />
              <Route path="/workflow/approval/pending" element={<WorkflowApprovalPendingPage />} />
              <Route path="/settings/users" element={<UserPage />} />
              <Route path="/settings/groups" element={<GroupPage />} />
              <Route path="/forms" element={<FormPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </MeProvider>
  );
}