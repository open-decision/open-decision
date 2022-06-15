import { safeFetch } from "./safeFetch";
import {
  registerOutput,
  registerUrl,
  TRegisterOutput,
} from "@open-decision/auth-api-specification";

export const register = (
  email: string,
  password: string,
  onSuccess: (data: TRegisterOutput) => void,
  onError: (error: string) => void
) =>
  safeFetch(
    `/external-api${registerUrl}`,
    { method: "POST", body: { email, password } },
    {
      throwingValidation: registerOutput.parse,
      onSuccess,
      onError,
    }
  );
