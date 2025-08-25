import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  
  const loginUser = (userData) => {
    localStorage.setItem("authData", JSON.stringify(userData));
    setUser(userData);

    console.log("User Logged In:");
    console.log("Username:", userData.userName);
    console.log("Role:", userData.role);
    console.log("Token:", userData.token);
  };

  const logoutUser = () => {
    localStorage.removeItem("authData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
