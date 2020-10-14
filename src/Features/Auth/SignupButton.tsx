/** @jsx jsx */
import { Button, jsx } from "theme-ui";
import { FunctionComponent } from "react";
// import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "./authQueries";
import { useAuthToken } from "./useTokens";
import { useMutation } from "urql";

type registerUser = {
  register: {
    token: string;
    refreshToken: string;
  };
};

export const SignupButton: FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  const { setToken } = useAuthToken();

  const [, registerUser] = useMutation<registerUser>(REGISTER_USER);

  const handleRegisterUser = () =>
    registerUser({
      email: "test@outlook.de",
      password1: "fogmub-bifDaj-sarjo8",
      password2: "fogmub-bifDaj-sarjo8",
      username: "",
    }).then(({ data, error }) => {
      if (error) {
        console.error("registerUser failed", error);
      } else {
        data.register.token ? setToken(data.register.token) : null;
      }
    });

  //TODO handle Auth Failure in UI
  return (
    <Button onClick={handleRegisterUser} className={className}>
      Registrieren
    </Button>
  );
};
