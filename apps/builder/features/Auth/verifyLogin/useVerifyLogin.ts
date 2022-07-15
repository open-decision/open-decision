import * as React from "react";
import { useActor, useInterpret } from "@xstate/react";
import {
  createVerifyLoginMachine,
  onVerify,
  onVerifyFailure,
} from "./verifyLogin.machine";

export function useVerifyLogin(
  email: string,
  onVerify: onVerify,
  onVerifyFailure?: onVerifyFailure
) {
  const verifyLoginMachine = React.useCallback(
    () => ,
    [email, onVerify, onVerifyFailure]
  );

  const service = useInterpret(verifyLoginMachine);

  return useActor(service);
}
