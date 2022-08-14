import { request } from "@playwright/test";
import { TTreeStatus } from "@open-decision/models";
import { TCreateTreeOutput } from "@open-decision/tree-api-specification";

export async function createTree(
  data: { name: string; status: TTreeStatus },
  baseURL: string
) {
  const requestContext = await request.newContext({
    baseURL,
    storageState: "./storageState.json",
  });

  const response = await requestContext.post(`/api/external-api/trees`, {
    data,
  });

  const body: TCreateTreeOutput = await response.json();

  return body;
}

export type createTreeReturn = Awaited<ReturnType<typeof createTree>>;
