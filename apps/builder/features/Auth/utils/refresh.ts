import {
  refreshTokenOutput,
  TRefreshTokenOutput,
} from "@open-decision/auth-api-specification";
import { safeFetch } from "./safeFetch";

export const refresh = (
  onSuccess: (data: TRefreshTokenOutput) => void,
  onError: (error: string) => void
) =>
  safeFetch(
    "/external-api/auth/refresh-tokens",
    { method: "POST", credentials: "include" },
    {
      throwingValidation: refreshTokenOutput.parse,
      onSuccess,
      onError,
    }
  );
