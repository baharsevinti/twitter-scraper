import React, { createContext, useContext, useState, ReactNode } from 'react';


type APIContextType = {
  get: (url: string) => Promise<unknown>;
  post: (url: string, body: unknown) => Promise <unknown>;
  put: (url: string, body: unknown) => Promise<unknown>;
  delete: (url: string) => Promise<unknown>;
  setToken: (token: string) => void;
};


const APIContext = createContext<APIContextType | undefined>(undefined);


const APIProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

 
  const getHeaders = () => {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };


  const get = async (url: string) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  };

  
  const post = async (url: string, body: unknown) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  };


  const put = async (url: string, body: unknown) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  };

  const del = async (url: string) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  };

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  return (
    <APIContext.Provider value={{ get, post, put, delete: del, setToken }}>
      {children}
    </APIContext.Provider>
  );
};


export const useAPI = () => {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error('useAPI must be used within an APIProvider');
  }
  return context;
};

export default APIProvider;
