import { request } from "@playwright/test";

export const logout = async (baseURL: string) => {
  const requestContext = await request.newContext({ baseURL });

  await requestContext.post(`/api/external-api/auth/logout`);

  await requestContext.dispose();
};
