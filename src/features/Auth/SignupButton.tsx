import React from "react";
import { FunctionComponent } from "react";
import { useAuthToken } from "./useTokens";
import { useRegister_UserMutation } from "@internalTypes/generated/graphql";
import { Button } from "@components/index";

export const SignupButton: FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  const [, setToken] = useAuthToken();
  const [, register] = useRegister_UserMutation();

  const handleRegisterUser = () =>
    register({
      email: "test@outlook.com",
      password1: "fogmub-bifaj-sarjo8",
      password2: "fogmub-bifaj-sarjo8",
      username: "",
    }).then(({ data, error }) => {
      if (error) {
        console.error("registerUser failed", error);
      } else {
        data.register.success === false
          ? console.error(data.register.errors)
          : setToken(data.register.token);
      }
    });

  //TODO handle Auth Failure in UI
  return (
    <Button onClick={handleRegisterUser} className={className}>
      Registrieren
    </Button>
  );
};
