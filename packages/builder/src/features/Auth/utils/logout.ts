export const logout = () =>
  fetch("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
