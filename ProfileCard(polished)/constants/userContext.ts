// @/constants/userContext.ts

import { createContext } from "react";
import React from "react";

export interface UserData { 
  username: string;
  description: string;
  Bio: string;
  ProfileUri: number | string; 
  BannerUri: number | string; 
}

export interface UserContextType extends UserData {
  setUser: (newUser: UserData) => void;
}

export const defaultUserData: UserData = {
  username: "Otika Nelson",
  description: "Software Engineer",
  Bio: "I am 20, I am a talented artist, I love graphics design, I am 6ft 3Inch, and I love Light-skinned women",
  ProfileUri: require("@/assets/images/Profile_1.jpg"),
  BannerUri: require("@/assets/images/banner_1.jpg"),
};

export const userContext = createContext<UserContextType>({
    ...defaultUserData,
    setUser: () => {},
});