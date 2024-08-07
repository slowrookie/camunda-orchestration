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
  DesktopFlow20Filled,
  DesktopFlow20Regular,
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
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup
} from "@fluentui/react-nav-preview";
import { useNavigate, useLocation } from "react-router-dom";
import { Me, signOut } from "../services/auth.service";
import { useEffect, useState } from "react";

const SysSettignsIcon = bundleIcon(PersonSettings20Filled, PersonSettings20Regular);
const WorkflowIcon = bundleIcon(Flowchart20Filled, Flowchart20Regular);
// const Settings = bundleIcon(Settings20Filled, Settings20Regular);
const SignOutIcon = bundleIcon(SignOut20Filled, SignOut20Regular);
const BusinessIcon = bundleIcon(HexagonThree20Filled, HexagonThree20Regular);
const FormIcon = bundleIcon(Form20Filled, Form20Regular);
const DesktopFlowIcon = bundleIcon(DesktopFlow20Filled, DesktopFlow20Regular);

const NavMenuData = [
  { group: '业务流程', icon: BusinessIcon},
  {
    id: "/dashboard/workflow/approval",
    name: "流程审批",
    icon: DesktopFlowIcon,
    children: [
      {
        id: "/dashboard/workflow/approval/submitted",
        name: "已提交",
      },
      {
        id: "/dashboard/workflow/approval/pending",
        name: "待处理",
      }
    ]
  },
  {
    id: "/dashboard/worflow",
    name: "流程建模",
    icon: BusinessIcon,
    children: [
      {
        id: "/dashboard/workflow/2",
        name: "功能编排",
      },
      {
        id: "/dashboard/workflow/3",
        name: "版本演进",
      },
      {
        id: "/dashboard/workflow/4",
        name: "建模概念",
      }
    ]
  },
  { group: '配置', icon: BusinessIcon },
  {
    id: "/dashboard/workflows",
    name: "流程管理",
    icon: WorkflowIcon,
  },
  {
    id: "/dashboard/forms",
    name: "表单管理",
    icon: FormIcon,
  },
  {
    id: "/dashboard/settings",
    name: "系统设置",
    icon: SysSettignsIcon,
    children: [
      {
        id: "/dashboard/settings/users",
        name: "用户管理",
      },
      {
        id: "/dashboard/settings/groups",
        name: "分组管理",
      }
    ]
  }
]

export type INavMenuProps = {
  navDrawerProps?: NavDrawerProps;
  me: Me | undefined;
}

export const NavMenu = (props: INavMenuProps) => {
  const navigate = useNavigate();
  const _location = useLocation();
  const [selectedValue, setSelectedValue] = useState<string>("1.1");
  const [selectedCategoryValue, setSelectedCategoryValue] = useState<string>("1");

  // router selected
  useEffect(() => {
    const path = _location.pathname;
    const findItem = (): any => {
      for (let i = 0; i < NavMenuData.length; i++) {
        const item = NavMenuData[i];
        if (item.id && item.id === path) {
          return item;
        } else if (item.children) {
          for (let j = 0; j < item.children?.length; j++) {
            const subItem = item.children[j];
            if (subItem.id === path) {
              return subItem;
            }
          }
        }
      }
    }
    const navItem = findItem();
    if (navItem) {
      let items: Array<any> = navItem.id.split("/");
      items.pop();
      setSelectedCategoryValue(items.join("/"));
      setSelectedValue(navItem.id);
    }

  }, [_location.pathname]);

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/login");
    });
  }

  return (
    <NavDrawer
      {...props}
      separator
      open
      onNavItemSelect={(_: any, d: any) => {
        setSelectedCategoryValue(d.categoryValue || d.value);
        setSelectedValue(d.value);
        d.value && navigate(d.value);
      }}
      selectedValue={selectedValue}
      selectedCategoryValue={selectedCategoryValue}
      size="small"
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
        {NavMenuData.map((item) => {
          if (item.group) {
            return <NavSectionHeader>{item.group}</NavSectionHeader>
          }
          if (item.children) {
            return (
              <NavCategory value={item.id} key={item.id}>
                <NavCategoryItem icon={<item.icon />}>
                  {item.name}
                </NavCategoryItem>
                <NavSubItemGroup>
                  {item.children.map((subItem) => (
                    <NavSubItem
                      key={subItem.id}
                      value={subItem.id}
                    >
                      {subItem.name}
                    </NavSubItem>
                  ))}
                </NavSubItemGroup>
              </NavCategory>
            );
          } else {
            return (
              <NavItem
                key={item.id}
                icon={<item.icon />}
                value={item.id}
              >
                {item.name}
              </NavItem>
            );
          }
        })}

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