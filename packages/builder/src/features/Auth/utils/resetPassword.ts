import { safeFetch } from "./safeFetch";

export const resetPassword = (
  password: string,
  token: string,
  onSuccess: () => void,
  onError: (error: string) => void
) =>
  safeFetch(
    "/api/auth/reset-password",
    { method: "POST", body: { password, token } },
    {
      onSuccess,
      onError,
      expectReturn: false,
    }
  );
