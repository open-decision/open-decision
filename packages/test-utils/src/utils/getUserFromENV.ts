import { User } from "@open-decision/prisma";

export const getUserFromEnv = (): User => {
  if (!process.env["USER"]) throw new Error("USER is not defined");
  const user = JSON.parse(process.env["USER"]);
  return user as User;
};
