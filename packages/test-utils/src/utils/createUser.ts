import { request } from "@playwright/test";

export async function createUser(email: string, baseURL?: string) {
  if (!baseURL) throw new Error("baseURL is required");

  const credentials = { email, password: "suptrbalo423!" };

  const requestContext = await request.newContext();
  await requestContext.post(`${baseURL}/api/external-api/auth/register`, {
    data: {
      ...credentials,
      toc: true,
    },
  });

  await requestContext.dispose();

  return credentials;
}

export type UserCredentials = Awaited<ReturnType<typeof createUser>>;
