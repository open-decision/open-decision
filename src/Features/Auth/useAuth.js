import React from "react";
import { getToken, fetchDatabase } from "../../backend-integration";
import { GET_TOKEN, LOGOUT_USER, REGISTER_USER } from "./authQueries";

//create a Context for the Authentication state to be shared across the entire App
const AuthContext = React.createContext({});

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

  const signup = async ({
    email = "test12@test.com",
    password1 = "123456!tewst",
    password2 = "123456!tewst",
    username = "Tester",
  }) => {
    const response = await fetchDatabase({
      query: REGISTER_USER,
      queryVariables: {
        email,
        username,
        password1,
        password2,
      },
    });

    const register = response.data.register;
    if (register.success) {
      setUser(register.token);
      return "success";
    }

    if (register.error) return register.error;
  };

  const signout = async (callback) => {
    //FIXME not sure why I need the Timeout
    const response = await fetchDatabase({ query: LOGOUT_USER });
    setTimeout(callback, 100);
    setUser(null);
    return response;
  };

  // Return the user object and auth methods
  return {
    user,
    signin,
    signout,
    signup,
  };
};
