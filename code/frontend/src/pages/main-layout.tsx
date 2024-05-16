import {
  Divider,
  Persona,
  Spinner,
  makeStyles,
  shorthands,
  tokens
} from "@fluentui/react-components";
import {
  Flowchart20Filled,
  Flowchart20Regular,
  PersonSettings20Filled,
  PersonSettings20Regular,
  SignOut20Filled,
  SignOut20Regular,
  bundleIcon
} from "@fluentui/react-icons";
import {
  NavCategory,
  NavCategoryItem,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  NavDrawerHeaderNav,
  NavItem,
  NavSubItem,
  NavSubItemGroup
} from "@fluentui/react-nav-preview";
import { useMe, useSignOut } from "../services/auth.service";

const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    display: "flex",
    height: "100vh",
  },
  nav: {
    overflow: "hidden",
    display: "flex",
    height: "100vh",
  },
  content: {
    flex: '1 1 auto',
    ...shorthands.padding("16px"),

    display: "grid",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gridRowGap: tokens.spacingVerticalXXL,
    gridAutoRows: "max-content",
  },
  field: {
    display: "grid",
    gridRowGap: tokens.spacingVerticalS,
  },
});

const SysSettigns = bundleIcon(PersonSettings20Filled, PersonSettings20Regular);
const Workflow = bundleIcon(Flowchart20Filled, Flowchart20Regular);
// const Settings = bundleIcon(Settings20Filled, Settings20Regular);
const SignOut = bundleIcon(SignOut20Filled, SignOut20Regular);


export const MainLayout = () => {
  const styles = useStyles();
  const { data: me } = useMe();
  const { isMutating: signOuting, trigger } = useSignOut();

  const handleSignOut = () => {
    trigger({});
  }


  const someClickHandler = () => {
    console.log("someClickHandler");
  };

  return (
    <div className={styles.root}>
      <div className={styles.nav}>
        <NavDrawer
          separator
          open
          defaultSelectedValue="2"
          defaultSelectedCategoryValue="1"
          size="small"
        >
          <NavDrawerHeader>
            <NavDrawerHeaderNav>
              <Persona
                size="extra-large"
                textPosition="after"
                name={me?.username || "User"}
                avatar={{ color: "colorful" }}
                presence={{ status: "available" }}
                secondaryText={me?.id || "ID"}
              />
            </NavDrawerHeaderNav>
            <Divider />
          </NavDrawerHeader>
          <NavDrawerBody>
            <NavItem
              target="_blank"
              icon={<Workflow />}
              onClick={someClickHandler}
              value="1"
            >
              流程管理
            </NavItem>

            <NavCategory value="6">
              <NavCategoryItem icon={<SysSettigns />}>
                系统设置
              </NavCategoryItem>
              <NavSubItemGroup>
                <NavSubItem target="_blank" onClick={someClickHandler} value="7">
                  用户管理
                </NavSubItem>
                <NavSubItem target="_blank" onClick={someClickHandler} value="8">
                  分组管理
                </NavSubItem>
              </NavSubItemGroup>
            </NavCategory>

          </NavDrawerBody>
          <NavDrawerFooter>
            {/* <NavItem icon={<Settings />} target="_blank" onClick={someClickHandler} value="24">
              应用设置
            </NavItem> */}
            <NavItem 
              icon={signOuting ? <Spinner size="small" /> : <SignOut />} 
              target="_blank" onClick={handleSignOut} value="24">
              登出
            </NavItem>
          </NavDrawerFooter>
        </NavDrawer>
      </div>

      <div className={styles.content}>


      </div>
    </div>
  );
}