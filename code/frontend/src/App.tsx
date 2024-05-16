import { Toast, ToastBody, ToastTitle, Toaster, makeStyles, useId, useToastController, tokens } from '@fluentui/react-components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { SWRConfig, SWRConfiguration } from 'swr';
import './App.css';
import { Login } from './pages/login';
import { MainLayout } from './pages/main-layout';
import { defaultFetcherWithToken } from './services/api.service';

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground1,
    height: "100vh",
  }
});

function App() {
  const styles = useStyles();
  
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <MainLayout />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/users',
        element: <div>Hello users!</div>
      },
    ],
  );

  // http error toaster
  const httpErrorTasterId = useId('http-error-toaster');
  const { dispatchToast } = useToastController(httpErrorTasterId);

  const GloabalSWRConfig: SWRConfiguration = {
    fetcher: defaultFetcherWithToken,
    onError: (err, key) => {
        dispatchToast(
            <Toast>
              <ToastTitle>{key}</ToastTitle>
              <ToastBody>{err.message}</ToastBody>
            </Toast>,
            {intent: "error", position: "top-end"}
        )
    },
};
  

  return (
    <div className={styles.root}>
      <SWRConfig value={GloabalSWRConfig}>
        <Toaster toasterId={httpErrorTasterId} />
        <RouterProvider router={router} />
      </SWRConfig>
    </div>
    )
}

export default App
