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
  const [refreshToken, setRefreshToken] = React.useState(null);

  const signin = async ({
    email = "test@outlook.de",
    password = "fogmub-bifDaj-sarjo8",
    callback,
  }) => {
    const response = await fetchDatabase(
      { query: GET_TOKEN, dataAccessor: getToken },
      "",
      { email, password }
    );

    console.log(response);
    setTimeout(callback, 100);
    setUser(response.token);
    setRefreshToken(response.refreshToken);
  };

  const signup = async ({
    email = "test@outlook.de",
    password1 = "fogmub-bifDaj-sarjo8",
    password2 = "fogmub-bifDaj-sarjo8",
    username = "",
  }) => {
    const response = await fetchDatabase({ query: REGISTER_USER }, "", {
      email,
      username,
      password1,
      password2,
    });

    const register = response.data.register;
    if (register.success) {
      setUser(register.token);
      return "success";
    }

    if (register.error) return register.error;
  };

  const signout = async (callback) => {
    const response = await fetchDatabase({
      query: LOGOUT_USER,
      variables: { refreshToken },
    });
    setTimeout(callback, 100);
    setUser(null);
    setRefreshToken(null);
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
