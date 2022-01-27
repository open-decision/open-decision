import { safeFetch } from "./safeFetch";

export const resetPassword = (
  password: string,
  onSuccess: () => void,
  onError: (error: string) => void
) =>
  safeFetch(
    "/auth/reset-password",
    { method: "POST", body: { password } },
    {
      onSuccess,
      onError,
      expectReturn: false,
    }
  );