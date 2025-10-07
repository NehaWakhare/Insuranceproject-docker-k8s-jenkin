// src/context/AuthContext.js
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const loginUser = (data) => {
    // Build a clean user object
    const userData = {
      userId: data.userId,
      userName: data.userName,
      role: data.role,
      token: data.token,
    };

    // Save in localStorage and state
    localStorage.setItem("authData", JSON.stringify(userData));

    sessionStorage.setItem("userProfileId", data.userId);


    setUser(userData);

    console.log("User Logged In:", userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("authData");
     sessionStorage.removeItem("userProfileId");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
