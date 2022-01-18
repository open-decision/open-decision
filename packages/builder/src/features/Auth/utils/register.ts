export const register = () =>
  fetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: "phil.garb@outlook.de",
      password: "Th@t!shardToGuess",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
