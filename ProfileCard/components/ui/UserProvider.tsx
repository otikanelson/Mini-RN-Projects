import React, { useState, ReactNode, useContext } from "react";
import {
  UserContextType,
  UserData,
  defaultUserData,
  userContext,
} from "@/constants/userContext";

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<UserData>(defaultUserData);
  const setUser = (newUser: UserData) => {
    setUserState(newUser);
  };

  const contextValue: UserContextType = {
    ...user,
    setUser,
  };

  return (
    <userContext.Provider value={contextValue}>{children}</userContext.Provider>
  );
};
