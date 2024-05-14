import { DrawerProps } from "@fluentui/react-components";
import * as React from "react";
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
  NavSubItemGroup,
} from "@fluentui/react-nav-preview";
import {
  Button,
  Caption1Strong,
  Label,
  Radio,
  RadioGroup,
  makeStyles,
  shorthands,
  tokens,
  useId,
} from "@fluentui/react-components";
import {
  Board20Filled,
  Board20Regular,
  BoxMultiple20Filled,
  BoxMultiple20Regular,
  DataArea20Filled,
  DataArea20Regular,
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular,
  HeartPulse20Filled,
  HeartPulse20Regular,
  MegaphoneLoud20Filled,
  MegaphoneLoud20Regular,
  NavigationFilled,
  NotePin20Filled,
  NotePin20Regular,
  People20Filled,
  People20Regular,
  PeopleStar20Filled,
  PeopleStar20Regular,
  PersonFilled,
  PersonLightbulb20Filled,
  PersonLightbulb20Regular,
  PersonRegular,
  PersonSearch20Filled,
  PersonSearch20Regular,
  PreviewLink20Filled,
  PreviewLink20Regular,
  Settings20Filled,
  Settings20Regular,
  bundleIcon,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    display: "flex",
    height: "100vh",
    backgroundColor: "#fff",
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

  headingContent: {
    marginInlineStart: `10px`,
  },
  hamburger: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForeground2,
    textDecorationLine: "none",
    ":hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
    ":active": {
      backgroundColor: tokens.colorBrandBackground2Pressed,
    },
  },
});

const Person = bundleIcon(PersonFilled, PersonRegular);
const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Announcements = bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular);
const EmployeeSpotlight = bundleIcon(
  PersonLightbulb20Filled,
  PersonLightbulb20Regular
);
const Search = bundleIcon(PersonSearch20Filled, PersonSearch20Regular);
const PerformanceReviews = bundleIcon(
  PreviewLink20Filled,
  PreviewLink20Regular
);
const JobPostings = bundleIcon(NotePin20Filled, NotePin20Regular);
const Interviews = bundleIcon(People20Filled, People20Regular);
const HealthPlans = bundleIcon(HeartPulse20Filled, HeartPulse20Regular);
const TrainingPrograms = bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular);
const CareerDevelopment = bundleIcon(PeopleStar20Filled, PeopleStar20Regular);
const Analytics = bundleIcon(DataArea20Filled, DataArea20Regular);
const Reports = bundleIcon(
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular
);
const Settings = bundleIcon(Settings20Filled, Settings20Regular);

type DrawerType = Required<DrawerProps>["type"];


export const MainLayout = () => {

  const styles = useStyles();

  const labelId = useId("type-label");

  const [isOpen, setIsOpen] = React.useState(true);
  const [type, setType] = React.useState<DrawerType>("inline");

  const someClickHandler = () => {
    console.log("someClickHandler");
  };

  return (
    <div className={styles.root}>
      <NavDrawer
        defaultSelectedValue="2"
        defaultSelectedCategoryValue="1"
        open={isOpen}
        type={type}
        onOpenChange={(_, { open }) => setIsOpen(open)}
        size="small"
      >
        <NavDrawerHeader>
          <NavDrawerHeaderNav>
            <Button
              appearance="transparent"
              icon={<NavigationFilled />}
              className={styles.hamburger}
            />
          </NavDrawerHeaderNav>
        </NavDrawerHeader>
        <NavDrawerBody>
          <NavCategory value="6">
            <NavCategoryItem icon={<JobPostings />}>
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

          <NavItem
            target="_blank"
            icon={<Dashboard />}
            onClick={someClickHandler}
            value="1"
          >
            流程管理
          </NavItem>

        </NavDrawerBody>
        <NavDrawerFooter>
          <NavItem
            icon={<Settings />}
            target="_blank"
            onClick={someClickHandler}
            value="24"
          >
            应用配置
          </NavItem>
        </NavDrawerFooter>
      </NavDrawer>

      <div className={styles.content}>
        <Button appearance="primary" onClick={() => setIsOpen(!isOpen)}>
          {type === "inline" ? "Toggle" : "Open"}
        </Button>

        <div className={styles.field}>
          <Label id={labelId}>Type</Label>
          <RadioGroup
            value={type}
            onChange={(_, data) => setType(data.value as DrawerType)}
            aria-labelledby={labelId}
          >
            <Radio value="overlay" label="Overlay (Default)" />
            <Radio value="inline" label="Inline" />
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}