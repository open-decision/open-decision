import { safeFetch } from "./safeFetch";

export const resetPassword = (
  email: string,
  onSuccess: () => void,
  onError: (error: string) => void
) =>
  safeFetch(
    "/auth/forgot-password",
    { method: "POST", body: { email } },
    {
      onSuccess,
      onError,
      expectReturn: false,
    }
  );
