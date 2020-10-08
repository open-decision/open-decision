/** @jsx jsx */
import { Button, jsx } from "theme-ui";
import { FunctionComponent } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "./authQueries";
import { useAuthToken } from "./useTokens";

export const SignupButton: FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  const { setToken } = useAuthToken();

  const [mutationFn] = useMutation(REGISTER_USER, {
    variables: {
      email: "test@outlook.de",
      password1: "fogmub-bifDaj-sarjo8",
      password2: "fogmub-bifDaj-sarjo8",
      username: "",
    },
    onCompleted: (data) => {
      data.register.token ? setToken(data.register.token) : null;
    },
  });

  //TODO handle Auth Failure in UI
  return (
    <Button onClick={() => mutationFn()} className={className}>
      Registrieren
    </Button>
  );
};
