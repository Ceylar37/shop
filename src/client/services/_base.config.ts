if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
}

export const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

type RequestOptions = Omit<RequestInit, 'method' | 'body'>;
type RequestOptionsWithBody = RequestOptions & {body?: Record<string, any> | Array<any>};
export interface Error {
  message: string;
  status: number;
}

const myFetch = async (url: string, options: RequestInit) => {
  const res = await fetch(url, options);
  const json = await res.json();
  if (!res.ok) {
    throw json;
  }
  return json;
};

class ApiClient {
  backendURL: string;

  constructor(backendURL: string) {
    this.backendURL = backendURL;
  }

  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return await myFetch(`${this.backendURL}${url}`, {method: 'GET', ...options});
  }

  async post<T>(url: string, options: RequestOptionsWithBody = {body: undefined}): Promise<T> {
    const {body, ...data} = options;
    return await myFetch(`${this.backendURL}${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
      ...data,
    });
  }

  async put<T>(url: string, options: RequestOptionsWithBody = {body: undefined}): Promise<T> {
    const {body, ...data} = options;
    return await myFetch(`${this.backendURL}${url}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...data,
    });
  }

  async delete<T>(url: string, options: RequestOptionsWithBody = {body: undefined}): Promise<T> {
    const {body, ...data} = options;
    return myFetch(`${this.backendURL}${url}`, {
      method: 'DELETE',
      body: JSON.stringify(body),
      ...data,
    });
  }

  async patch<T>(url: string, options: RequestOptionsWithBody = {body: undefined}): Promise<T> {
    const {body, ...data} = options;
    return await myFetch(`${this.backendURL}${url}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...data,
    });
  }
}

export const apiClient = new ApiClient(backendURL);
