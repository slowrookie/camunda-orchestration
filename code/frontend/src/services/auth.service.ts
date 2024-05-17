import axios from "axios";
import { Page, PageRequest } from "./api.service";

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

export type User = {
  id: string;
  username: string;
}

const client_id = 'test';
const client_secret = 'test';
const basicAuth = btoa(`${client_id}:${client_secret}`);
const instance = axios.create();

export const signIn = async (u: LoginUser): Promise<AuthorizedAccess> => {
  const formdata = new FormData();
  formdata.append('grant_type', 'password');
  formdata.append('username', u.username);
  formdata.append('password', u.password);

  return instance.postForm('/api/auth/oauth2/token', formdata, {
    headers: {
      'Authorization': `Basic ${basicAuth}`,
    },
  }).then((res) => {
    axios.defaults.headers.common['Authorization'] = `${res.data.token_type} ${res.data.access_token}`;
    localStorage.setItem('authorizedAccss', JSON.stringify(res.data));
    return res.data;
  });
}

// get token
export const getAuthorizedAccess = (): (AuthorizedAccess | null) => {
  const data = localStorage.getItem('authorizedAccss');
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export const signOut = async (): Promise<any> => {
  const authorizedAccess = getAuthorizedAccess();
  if (!authorizedAccess || !authorizedAccess.access_token || !authorizedAccess.token_type) {
    window.location.href = '/app/login';
    return;
  }

  const formdata = new FormData();
  formdata.append('token', authorizedAccess.access_token);

  return instance.postForm('/api/auth/oauth2/revoke', {
    token: authorizedAccess.access_token,
  }, {
    headers: {
      'Authorization': `Basic ${basicAuth}`,
    },
  }).then(() => {
    axios.defaults.headers.common['Authorization'] = '';
    localStorage.removeItem('authorizedAccss');
  });
}

// me
export const me = async (): Promise<Me> => {
  return axios.get('/api/auth/oauth2/me')
    .then((res) => res.data);
}

export const users = async (pageRequest: PageRequest): Promise<Page<User>> => {
  return axios.get(`/api/auth/users?page=${pageRequest.number}&size=${pageRequest.size}`)
    .then((res) => res.data);
}