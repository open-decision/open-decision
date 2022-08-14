import { request } from "@playwright/test";

export async function publishTree(
  uuid: string,
  name: string,
  baseURL?: string
) {
  if (!baseURL) throw new Error("baseURL is required");

  const requestContext = await request.newContext({
    storageState: "storageState.json",
  });
  const response = await requestContext.post(
    `${baseURL}/api/external-api/trees/${uuid}/publishedTrees`,
    { data: { name } }
  );

  return response;
}

export type publishTreeReturn = Awaited<ReturnType<typeof publishTree>>;
