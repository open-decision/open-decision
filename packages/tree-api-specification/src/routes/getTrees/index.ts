import { TGetTreesInput } from "./input";
import { TGetTreesOutput } from "./output";

export const getTreesUrl = `/tree/trees`;

export const getTrees = async (
  url: string,
  inputs: TGetTreesInput
): Promise<TGetTreesOutput> => {
  const urlSearchParams = new URLSearchParams(inputs.query);

  const response = await fetch(`${url}${getTreesUrl}?${urlSearchParams}`, {
    headers: inputs.headers,
  });

  return response.json();
};

export * from "./input";
export * from "./output";
