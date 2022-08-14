import { User } from "@open-decision/prisma";
import { request } from "@playwright/test";

export const login = async (
  user: User,
  storagePath: string,
  fileName: string,
  baseURL?: string
) => {
  const requestContext = await request.newContext({ baseURL });

  await requestContext.post(`/api/external-api/auth/login`, {
    data: { email: user.email, password: user.password },
  });

  await requestContext.storageState({
    path: `sessions/${storagePath}/${fileName}.json`,
  });
  await requestContext.dispose();
};
