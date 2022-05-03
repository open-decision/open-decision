import { safeFetch } from "./safeFetch";

export const requestPasswordReset = (
  email: string,
  onSuccess: () => void,
  onError: (error: string) => void
) =>
  safeFetch(
    "/api/auth/forgot-password",
    { method: "POST", body: { email } },
    {
      onSuccess,
      onError,
      expectReturn: false,
    }
  );
