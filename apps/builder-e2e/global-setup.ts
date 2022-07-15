import { FullConfig, request } from "@playwright/test";
import prisma from "./client";

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  if (!baseURL) throw new Error("baseURL is not defined");

  await prisma.user.deleteMany();

  const requestContext = await request.newContext();
  await requestContext.post(`${baseURL}/api/external-api/auth/register`, {
    data: {
      email: "test@test.com",
      password: "Gettysburg1861",
      toc: true,
    },
  });

  await requestContext.storageState({ path: "storageState.json" });
  await requestContext.dispose();
}

export default globalSetup;
