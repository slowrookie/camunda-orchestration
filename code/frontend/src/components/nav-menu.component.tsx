import {
  Divider,
  Persona,
  makeStyles
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
  NavDrawerProps,
  NavItem,
  NavSubItem,
  NavSubItemGroup
} from "@fluentui/react-nav-preview";
import { useNavigate } from "react-router-dom";
import { Me, signOut } from "../services/auth.service";

const useStyles = makeStyles({
});

const SysSettigns = bundleIcon(PersonSettings20Filled, PersonSettings20Regular);
const Workflow = bundleIcon(Flowchart20Filled, Flowchart20Regular);
// const Settings = bundleIcon(Settings20Filled, Settings20Regular);
const SignOut = bundleIcon(SignOut20Filled, SignOut20Regular);

export type INavMenuProps = {
  navDrawerProps?: NavDrawerProps;
  me: Me | undefined;
}

export const NavMenu = (props: INavMenuProps) => {
  const styles = useStyles();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/login");
    });
  }

  const handleRouter = (path: string) => {
    navigate(path);
  }

  return (
    <NavDrawer
      separator
      open
      defaultSelectedValue="2"
      defaultSelectedCategoryValue="1"
      size="small"
      {...props}
    >
      <NavDrawerHeader>
        <NavDrawerHeaderNav>
          <Persona
            size="extra-large"
            textPosition="after"
            name={props.me?.username || "User"}
            avatar={{ color: "colorful" }}
            presence={{ status: "available" }}
            secondaryText={props.me?.id || "ID"}
          />
        </NavDrawerHeaderNav>
        <Divider />
      </NavDrawerHeader>
      <NavDrawerBody>
        <NavItem
          icon={<Workflow />}
          onClick={() => handleRouter("/dashboard/workflows")} 
          value="1"
        >
          流程管理
        </NavItem>

        <NavCategory value="2">
          <NavCategoryItem icon={<SysSettigns />}>
            系统设置
          </NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem onClick={() => handleRouter("/dashboard/users")} value="2.1">
              用户管理
            </NavSubItem>
            <NavSubItem onClick={() => handleRouter("/dashboard/groups")}value="2.2">
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
          icon={<SignOut />}
          target="_blank" onClick={handleSignOut} value="24">
          登出
        </NavItem>
      </NavDrawerFooter>
    </NavDrawer>
  );
}