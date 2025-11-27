import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUserState] = useState(
    () => JSON.parse(localStorage.getItem("authUser")) || null
  );

  const setAuthUser = (data) => {
    setAuthUserState(data.userObject);

    localStorage.setItem("token", data.token);
    localStorage.setItem("authUser", JSON.stringify(data));
  };
  const clearAuthUser = () => {
    setAuthUserState(null);
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
  };

 const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  return user !== null && user.userObject.role === "admin";
};
console.log(isAdmin(),"===============admin context")
  return (
    <AuthContext.Provider
      value={{ authUser, setAuthUser, clearAuthUser, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
