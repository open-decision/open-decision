import { LoginResponse, validateLoginResponse } from "./shared";
import { safeFetch } from "./safeFetch";

export const login = (
  email: string,
  password: string,
  onSuccess: (data: LoginResponse) => void,
  onError: (error: string) => void
) =>
  safeFetch(
    "/auth/login",
    { method: "POST", body: { email, password } },
    {
      throwingValidation: validateLoginResponse,
      onSuccess,
      onError,
    }
  );
