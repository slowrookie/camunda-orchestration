import useSWRMutation, { SWRMutationResponse } from "swr/mutation";
import {useNavigate} from "react-router-dom";
import { defaultFetcherWithToken, postFetcher } from "./api.service";
import useSWR, { SWRResponse } from "swr";

export type LoginUser = {
  username: string;
  password: string;
}

export type Me = {
  id: string;
  username: string;
}

export type AuthorizedAccess = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

const client_id = 'test';
const client_secret = 'test';
const basicAuth = btoa(`${client_id}:${client_secret}`);

// signIn
const signInFetcher = async <LoginUser>(url: string, { arg }: { arg: LoginUser }) => {
  const formdata = new FormData();
  formdata.append('grant_type', 'password');
  formdata.append('username', (arg as any).username);
  formdata.append('password', (arg as any).password);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
    },
    body: formdata
  });
  if (!res.ok) {
    const error = new Error(`${res.status} An error occurred while login fetching`);
    throw error;
  }
  return res.json();
}

// signIn
const signOutFetcher = async (url: string, { arg }: { arg: any }) => {
  const authorizedAccess = getAuthorizedAccess();
  if (!authorizedAccess || !authorizedAccess.access_token || !authorizedAccess.token_type) {
    window.location.href = '/login';
    return;
  }

  const formdata = new FormData();
  formdata.append('token', authorizedAccess.access_token);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
    },
    body: formdata
  });
  if (!res.ok) {
    const error = new Error(`${res.status} An error occurred while login fetching`);
    throw error;
  }
}

export const useSignIn = (): SWRMutationResponse<any, any, string, LoginUser> => {
  const navigator = useNavigate();
  
  return useSWRMutation('/api/auth/oauth2/token', signInFetcher, {
    onSuccess(data: AuthorizedAccess) {
      localStorage.setItem('authorizedAccss', JSON.stringify(data));
      navigator('/');
    },
  })
}

// get token
export const getAuthorizedAccess = (): (AuthorizedAccess | null) => {
  const data = localStorage.getItem('authorizedAccss');
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export const useSignOut = (): SWRMutationResponse<any, any, string, any> => {
  const navigator = useNavigate();
  return useSWRMutation('/api/auth/oauth2/revoke', signOutFetcher, {
    onSuccess: () => {
      localStorage.removeItem('authorizedAccss');
      navigator('/login');
    }
  });
}

// me
export const useMe = (): SWRResponse<Me> => {
  return useSWR('/api/auth/oauth2/me');
}