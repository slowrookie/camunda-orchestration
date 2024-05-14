import { Button, Input, Spinner, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { LockClosedRegular, PersonRegular } from "@fluentui/react-icons";
import LoginIllustration from '../assets/login-illustration.svg';
import { useLogin, LoginUser } from "../services/auth.service";
import { useState } from "react";

const useStyles = makeStyles({
  loginPage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  loginContainer: {
    boxShadow: tokens.shadow16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground3,
  },
  loginImg: {
    minWidth: "500px",
    minHeight: "500px",
    backgroundColor: tokens.colorNeutralBackground2Hover
  },
  loginPanel: {
    minWidth: "300px",
    padding: tokens.spacingVerticalXXXL,
  },
  loginPanelProjectName: {
    color: tokens.colorBrandBackground,
    fontSize: tokens.fontSizeHero700,
    lineHeight: tokens.lineHeightHero700,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalXXXL,
    textAlign: "center",
  },
  loginPanelTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalXL,
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  field: {
    display: "grid",
    gridRowGap: tokens.spacingVerticalXXS,
    ...shorthands.padding(tokens.spacingHorizontalMNudge),
  }
})

export const Login = () => {
  const styles = useStyles();
  const [loginUser, setLoginUser] = useState<LoginUser>({ username: "", password: "" });
  const { isMutating, trigger } = useLogin();

  const handleLogin = () => {
    trigger(loginUser);
  }

  return (<>
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginImg}>
          <img src={LoginIllustration} alt="Login illustration" />
        </div>
        <div className={styles.loginPanel}>
          <div className={styles.loginPanelProjectName}>业务建探索与模实践</div>
          <div className={styles.loginPanelTitle}>账号登录</div>
          <div className={styles.loginForm}>
            <div className={styles.field}>
              <Input contentBefore={<PersonRegular />} placeholder="用户名" size="large" id="username" value={loginUser.username}
                onChange={(_, v) => { setLoginUser({ ...loginUser, username: v.value }) }}
              />
            </div>
            <div className={styles.field}>
              <Input contentBefore={<LockClosedRegular />} placeholder="密码" type="password" size="large" id="password"
                value={loginUser.password}
                onChange={(_, v) => { setLoginUser({ ...loginUser, password: v.value }) }} />
            </div>
            <div className={styles.field}>
              <Button appearance="primary" size="large" onClick={handleLogin}
                disabledFocusable={isMutating || !loginUser.username || !loginUser.password}
                icon={isMutating ? <Spinner size="tiny" /> : undefined}
              >登录</Button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </>);
}