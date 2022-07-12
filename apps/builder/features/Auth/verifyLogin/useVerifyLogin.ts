import * as React from "react";
import { ODProgrammerError } from "@open-decision/type-classes";
import { useActor, useInterpret } from "@xstate/react";
import {
  createVerifyLoginMachine,
  onVerify,
  onVerifyFailure,
} from "./verifyLogin.machine";

export function useVerifyLogin(
  onVerify: onVerify,
  onVerifyFailure?: onVerifyFailure
) {
  if (!email)
    throw new ODProgrammerError({
      code: "TRIED_VERIFY_UNAUTHENTICATED_USER_LOGIN",
      message: "Tried to verify login for unauthenticated user.",
    });

  const verifyLoginMachine = React.useMemo(
    () => createVerifyLoginMachine(email, onVerify, onVerifyFailure),
    [email, onVerify, onVerifyFailure]
  );

  const service = useInterpret(verifyLoginMachine);

  return [email, ...useActor(service)] as const;
}
