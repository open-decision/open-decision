import React from "react";
import { getToken, GET_TOKEN, fetchDatabase } from "../backend-integration";

const AuthContext = React.createContext({
  user: "",
  signin: () => {},
  signout: () => {},
});

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

const useProvideAuth = () => {
  const [user, setUser] = React.useState(null);

  const signin = async (
    email = "demo@open-decision.org",
    password = "fogmub-bifDaj-sarjo8"
  ) => {
    const token = await fetchDatabase(GET_TOKEN, { email, password }, getToken);
    return setUser(token);
  };

  // const signup = (email, password) => {};

  const signout = () => setUser(null);

  // Return the user object and auth methods
  return {
    user,
    signin,
    signout,
  };
};
