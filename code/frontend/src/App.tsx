import { Toast, ToastBody, ToastTitle, Toaster, makeStyles, tokens, useId, useToastController } from '@fluentui/react-components';
import { AxiosError } from 'axios';
import { useEffect, useMemo } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { Login } from './pages/login.page';
import { MainLayout } from './pages/main.layout';
import { setupAxiosInterceptors } from './services/api.service';

const router = createBrowserRouter(
  [
    {
      path: '/dashboard/*',
      element: <MainLayout />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />
    },
  ],
  {
    basename: '/app',
  }
);

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground1,
    height: "100vh",
  }
});

// setupAxiosInterceptors(() => {});

function App() {
  const styles = useStyles();

  useEffect(() => {
    if (window.location.pathname === '/') {
      window.location.href = '/app';
    }
  }, []);

  // http error toaster
  const httpErrorTasterId = useId('http-error-toaster');
  const { dispatchToast } = useToastController(httpErrorTasterId);

  const httpErrorResponse = (error: AxiosError<any, any>) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{error.code}</ToastTitle>
        <ToastBody>{error.message}</ToastBody>
      </Toast>,
      { intent: "error", position: "top-end" }
    )
  };

  useMemo(() => {
    setupAxiosInterceptors(httpErrorResponse);
  }, []);

  return (
    <div className={styles.root}>
      <Toaster toasterId={httpErrorTasterId} />
      <RouterProvider router={router} />
    </div>
  )
}

export default App
