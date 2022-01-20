import { safeFetch } from "./safeFetch";
import { LoginResponse, validateLoginResponse } from "./shared";

export const refresh = (
  onSuccess: (data: LoginResponse) => void,
  onError: (error: string) => void
) =>
  safeFetch(
    "/auth/refresh-tokens",
    { method: "POST", credentials: "include" },
    {
      throwingValidation: validateLoginResponse,
      onSuccess,
      onError,
    }
  );
