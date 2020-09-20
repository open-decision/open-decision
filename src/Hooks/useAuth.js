import React from "react";
import { getToken, GET_TOKEN, fetchDatabase } from "../backend-integration";

//create a Context for the Authentication state to be shared across the entire App
const AuthContext = React.createContext({
  user: "",
  signin: () => {},
  signout: () => {},
});

//Higher Order Component to wrap the application in the context produced by calling useProviderAuth
export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

//Hook to receive the current AuthContext anywhere in the application
export const useAuth = () => {
  return React.useContext(AuthContext);
};

//Hook that manages the user token and the methods associated with the auth state of the user
//TODO add more of the functions for the user lifecycle
//TALK should the associated queries be part of the functions and not defined separately?
//TALK the user object should consist of more user information and not just the auth token
const useProvideAuth = () => {
  const [user, setUser] = React.useState(null);

  const signin = async ({
    email = "demo@open-decision.org",
    password = "fogmub-bifDaj-sarjo8",
    callback,
  }) => {
    const token = await fetchDatabase({
      query: GET_TOKEN,
      queryVariables: { email, password },
      dataAccessor: getToken,
    });
    //FIXME not sure why I need the Timeout
    setTimeout(callback, 100);
    return setUser(token);
  };

  // const signup = (email, password) => {};

  const signout = (callback) => {
    //FIXME not sure why I need the Timeout
    setTimeout(callback, 100);
    return setUser(null);
  };

  // Return the user object and auth methods
  return {
    user,
    signin,
    signout,
  };
};
