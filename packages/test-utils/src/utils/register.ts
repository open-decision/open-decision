import { TRegisterOutput } from "@open-decision/auth-api-specification";
import { request } from "@playwright/test";
import { User } from "@open-decision/prisma";

export const register = async (user: User, baseURL: string) => {
  const requestContext = await request.newContext({ baseURL });

  const response = await requestContext.post(
    `/api/external-api/auth/register`,
    {
      data: { email: user.email, password: user.password, toc: true },
    }
  );

  await requestContext.storageState({ path: "storageState.json" });

  const body: TRegisterOutput = await response.json();

  return { ...body.user, password: user.password };
};
