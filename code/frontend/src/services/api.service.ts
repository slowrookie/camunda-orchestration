export async function postFetcher<T>(url: string, { arg }: { arg: T }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res: Response) => {
    console.log(res);
    if (!res.ok) {
      const error = new Error(`${res.status} An error occurred while fetching`);
      throw error;
    }
    
    // no content
    if (res.status === 204) {
      return null;
    }
    
    return res.json();
  });
}