import * as React from "react";
import { ODProgrammerError } from "@open-decision/type-classes";
import { useActor, useInterpret } from "@xstate/react";
import { useAuth } from "../useAuth";
import {
  createVerifyLoginMachine,
  onVerify,
  onVerifyFailure,
} from "./verifyLogin.machine";

export function useVerifyLogin(
  onVerify: onVerify,
  onVerifyFailure?: onVerifyFailure
) {
  const [
    {
      context: { auth },
    },
  ] = useAuth();

  if (!auth?.user.email)
    throw new ODProgrammerError({
      code: "TRIED_VERIFY_UNAUTHENTICATED_USER_LOGIN",
      message: "Tried to verify login for unauthenticated user.",
    });

  const email = auth.user.email;

  const verifyLoginMachine = React.useMemo(
    () => createVerifyLoginMachine(email, onVerify, onVerifyFailure),
    [email, onVerify]
  );

  const service = useInterpret(verifyLoginMachine);

  return [auth.user.email, ...useActor(service)] as const;
}
