import { createContext, useContext, useMemo, useState } from "react";
import { loginWithEmail, loginWithGoogle, logout, registerWithEmail } from "../services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("studyforge_user");
    return saved ? JSON.parse(saved) : null;
  });

  const persistUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem("studyforge_user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("studyforge_user");
    }
  };

  const value = useMemo(
    () => ({
      user,
      signInGoogle: async () => persistUser(await loginWithGoogle()),
      signInEmail: async (email, password) => persistUser(await loginWithEmail(email, password)),
      signUpEmail: async (email, password) => persistUser(await registerWithEmail(email, password)),
      signOutUser: async () => {
        await logout();
        persistUser(null);
      }
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
