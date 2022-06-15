import { safeFetch } from "./safeFetch";
import {
  loginOutput,
  TLoginOutput,
} from "@open-decision/auth-api-specification";

export const login = (
  email: string,
  password: string,
  onSuccess: (data: TLoginOutput) => void,
  onError: (error: string) => void
) =>
  safeFetch(
    "/external-api/auth/login",
    { method: "POST", body: { email, password } },
    {
      throwingValidation: loginOutput.parse,
      onSuccess,
      onError,
    }
  );
