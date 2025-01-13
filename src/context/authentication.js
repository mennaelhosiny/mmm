import { createContext, useEffect, useState } from "react";

export const authContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken !== null) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    return () => {
    };
  }, []);

  return (
    <authContext.Provider value={{ token, setToken }}>
      {children}
    </authContext.Provider>
  );
}
