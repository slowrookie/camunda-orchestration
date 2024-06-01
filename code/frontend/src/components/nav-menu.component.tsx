import {
  Divider,
  Persona
} from "@fluentui/react-components";
import {
  Flowchart20Filled,
  Flowchart20Regular,
  HexagonThree20Filled,
  HexagonThree20Regular,
  PersonSettings20Filled,
  PersonSettings20Regular,
  SignOut20Filled,
  SignOut20Regular,
  Form20Filled,
  Form20Regular,
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

const SysSettignsIcon = bundleIcon(PersonSettings20Filled, PersonSettings20Regular);
const WorkflowIcon = bundleIcon(Flowchart20Filled, Flowchart20Regular);
// const Settings = bundleIcon(Settings20Filled, Settings20Regular);
const SignOutIcon = bundleIcon(SignOut20Filled, SignOut20Regular);
const BusinessIcon = bundleIcon(HexagonThree20Filled, HexagonThree20Regular);
const FormIcon = bundleIcon(Form20Filled, Form20Regular);

export type INavMenuProps = {
  navDrawerProps?: NavDrawerProps;
  me: Me | undefined;
}

export const NavMenu = (props: INavMenuProps) => {
  
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

        <NavCategory value="4">
            <NavCategoryItem icon={<BusinessIcon />}>
              流程建模
            </NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem onClick={() => {}} value="4.1">
                常规审批
              </NavSubItem>
              <NavSubItem onClick={() => {}} value="4.2">
                版本演进
              </NavSubItem>
              <NavSubItem onClick={() => {}} value="4.3">
                功能编排
              </NavSubItem>
            </NavSubItemGroup>
        </NavCategory>

        <NavItem
          icon={<WorkflowIcon />}
          onClick={() => handleRouter("/dashboard/workflows")} 
          value="1"
        >
          流程管理
        </NavItem>

        <NavItem
          icon={<FormIcon />}
          onClick={() => handleRouter("/dashboard/forms")} 
          value="2"
        >
          表单管理
        </NavItem>

        <NavCategory value="3">
          <NavCategoryItem icon={<SysSettignsIcon />}>
            系统设置
          </NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem onClick={() => handleRouter("/dashboard/users")} value="3.1">
              用户管理
            </NavSubItem>
            <NavSubItem onClick={() => handleRouter("/dashboard/groups")}value="3.2">
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
          icon={<SignOutIcon />}
          target="_blank" onClick={handleSignOut} value="24">
          登出
        </NavItem>
      </NavDrawerFooter>
    </NavDrawer>
  );
}