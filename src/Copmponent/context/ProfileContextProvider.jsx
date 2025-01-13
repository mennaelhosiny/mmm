import { createContext, useState, useEffect } from "react";

export const profileContext = createContext();

export function ProfileContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("token");
  };

  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const getUserData = () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData")) || null;
    setUserData(storedUserData);
  };

  const updateUserProfile = (updatedData) => {
    setUserData((prevUserData) => {
      const newUserData = { ...prevUserData, ...updatedData };
      localStorage.setItem("userData", JSON.stringify(newUserData));
      return newUserData;
    });
  };

  const changeUserPassword = (newPassword) => {
    console.log("Password changed to:", newPassword);
  };

  const deleteUserAccount = () => {
    setUserData(null);
    setToken("");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    console.log("User account deleted");
  };

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      getUserData();
    }
  }, [token]);

  return (
    <profileContext.Provider
      value={{
        userData,
        getUserData,
        updateUserProfile,
        changeUserPassword,
        deleteUserAccount,
        setToken: updateToken,
      }}
    >
      {children}
    </profileContext.Provider>
  );
}
