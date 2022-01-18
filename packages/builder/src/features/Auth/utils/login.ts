import { z } from "zod";

const loginResponse = z.object({
  access: z.object({ token: z.string() }),
});

export const login = () =>
  fetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "phil.garb@outlook.de",
      password: "Th@t!shardToGuess",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => loginResponse.parse(await res.json()));
