import { LoginResponse, validateLoginResponse } from "./shared";
import { safeFetch } from "./safeFetch";

export const register = (
  email: string,
  password: string,
  onSuccess: (data: LoginResponse) => void,
  onError: (error: string) => void
) =>
  safeFetch(
    "/api/auth/register",
    { method: "POST", body: { email, password } },
    {
      throwingValidation: validateLoginResponse,
      onSuccess,
      onError,
    }
  );
