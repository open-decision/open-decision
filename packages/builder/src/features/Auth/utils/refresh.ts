import { z } from "zod";

const refreshResponse = z.object({
  access: z.object({ token: z.string() }),
});

export const refresh = () =>
  fetch("/auth/refresh-tokens", {
    method: "POST",
    credentials: "include",
  }).then(async (res) => refreshResponse.parse(await res.json()));
