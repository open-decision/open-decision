import { safeFetch } from "./safeFetch";

export const logout = (
  onSuccess: () => void,
  onError: (error: string) => void
) =>
  safeFetch(
    "/api/auth/logout",
    { method: "POST", credentials: "include" },
    {
      onSuccess,
      onError,
    }
  );
