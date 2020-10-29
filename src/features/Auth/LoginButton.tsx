import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FunctionComponent } from "react";
import { useAuthToken, useRefreshToken } from "./useTokens";
import { LocationState } from "@internalTypes/global";
import { useLogin_UserMutation } from "@internalTypes/generated/graphql";
import { Button } from "@components/index";

//This type defines the props the LoginButton component accepts
type Props = {
  className?: string;
  email?: string;
  password?: string;
};

export const LoginButton: FunctionComponent<Props> = ({
  //for development porposes are email and password provided with a default value
  className,
  email = "test@outlook.com",
  password = "fogmub-bifaj-sarjo8",
}) => {
  //The use... wording is a convention around React Hooks. We rely heavily on Hooks so please have a look into them if you haven't already.
  //The first two hooks provide a method to set the token. The token is internally stored in the browsers local storage so it is persistent across site refreshs
  const [, setAuthToken] = useAuthToken();
  const [, setRefreshToken] = useRefreshToken();

  //This hook provides us a function that fetches our data or performs a mutation when called
  const [, login] = useLogin_UserMutation();

  //-------------------------------------------------------------------------
  //These hooks are provided by our router to access the current location and the history to simulate the forward - backward behaviour a user expects. For issue #4 you can ignore this part for now.
  const history = useHistory();
  const location = useLocation<LocationState>();

  const { from } = location.state || {
    from: { pathname: "/" },
  };
  //-------------------------------------------------------------------------

  //The Syntax on... is a convention signaling, that this function is called as a reaction to an event (usually by the user). This function calls login with the credentials entered by the user and returns a Promise (have a look into Promises if you haven't already - the async await syntax is a syntactical addition that is nicer to write, but at its core still a Promise - check both).
  const onClickHandler = () =>
    login({ email, password }).then(({ data, error }) => {
      //We check whether an error occured.
      if (error) console.error("loginUser failed", error);
      //The following syntax data?.tokenAuth is a Stage 3 Language proposal in Javascript called optional chaining and works for us because of Typescript. If the path does not exist it resolved to undefined and does not throw a runtime exception. We use this to safely get the data from our response.
      const tokenAuth = data?.tokenAuth;

      //We check whether the data is undefined or null before we proceed.
      if (tokenAuth?.token == null) return console.error("no token received");
      if (tokenAuth?.refreshToken == null)
        return console.error("no refreshToken received");

      //After all our checks we can safely call onCompleted to actually log the user in.
      onCompleted(tokenAuth.token, tokenAuth.refreshToken);
    });

  //This function is called when we have successfully received a token and a refreshToken from our API call. When this is called the user is logged in.
  const onCompleted = (token: string, refreshToken: string) => {
    setAuthToken(token);
    setRefreshToken(refreshToken);
    //This is part of the routing solution you can ignore for issue #4.
    history.replace(from);
  };

  //FIXME handle Errors in UI
  //This is the Button that is shown in the UI. onClick is called when the user clicks the Button.
  return (
    <Button className={className} onClick={onClickHandler}>
      Login
    </Button>
  );
};
