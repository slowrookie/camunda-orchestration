import { getAuthorizedAccess } from "./auth.service";

export const defaultFetcherWithToken = async (url: string) => {
  const authorizedAccess = getAuthorizedAccess();
  if (!authorizedAccess || !authorizedAccess.access_token || !authorizedAccess.token_type) {
    window.location.href = '/login';
    return;
  }
  const requestInit: RequestInit = {
    headers: {
      "Authorization": `${authorizedAccess?.token_type} ${authorizedAccess?.access_token}`
    }
  }
  return fetch(url, requestInit).then((res: Response) => {
    if (res.status === 401) {
      window.location.href = '/login';
      return;
    }

    if (!res.ok) {
      const error = new Error(`${res.status} An error occurred while default fetching`);
      throw error;
    }
    
    if (res.status === 204) {
      return null;
    }
    
    return res.json();
  });
}

export const postFetcher = async <T>(url: string, { arg }: { arg: T }) => {
  const authorizedAccess = getAuthorizedAccess();
  if (!authorizedAccess || !authorizedAccess.access_token || !authorizedAccess.token_type) {
    window.location.href = '/login';
    return;
  }
  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      "Authorization": `${authorizedAccess?.token_type} ${authorizedAccess?.access_token}`,
      'Content-Type': 'application/json'
    },
    body: arg as any
  }

  const res = await fetch(url, requestInit);
  if (res.status === 401) {
    window.location.href = '/login';
    return;
  }
  if (!res.ok) {
    const error = new Error(`${res.status} An error occurred while post fetching`);
    throw error;
  }
  // no content
  if (res.status === 204) {
    return null;
  }
  return res.json();
}