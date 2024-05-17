import { Button, Image, Input, Spinner, makeStyles, shorthands, tokens, typographyStyles } from "@fluentui/react-components";
import { LockClosedRegular, PersonRegular } from "@fluentui/react-icons";
import LoginIllustration from '../assets/login-illustration.svg';
import { signIn, LoginUser } from "../services/auth.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  loginPage: {
    display: "flex",
    flexDirection: "column",
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
  projectTitle: {
    ...typographyStyles.title2,
    marginBottom: tokens.spacingVerticalS,
    textAlign: "center",
  },
  projectSubTitle: {
    ...typographyStyles.subtitle2,
    textAlign: "center",
    marginBottom: tokens.spacingVerticalXXXL,
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
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState<LoginUser>({ username: "", password: "" });
  const [isLoging, setIsLoging] = useState(false);

  const handleLogin = () => {
    setIsLoging(true);
    signIn(loginUser).then(() => {
      setIsLoging(false);
      navigate("/dashboard");
    });
  }

  return (<>
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <Image className={styles.loginImg} src={LoginIllustration} alt="Login illustration" />
        <div className={styles.loginPanel}>
          <div className={styles.projectTitle}>业务流程建模</div>
          <div className={styles.projectSubTitle}>(探索与模实践)</div>
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
                disabledFocusable={isLoging || !loginUser.username || !loginUser.password}
                icon={isLoging ? <Spinner size="tiny" /> : undefined}
              >登录</Button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </>);
}