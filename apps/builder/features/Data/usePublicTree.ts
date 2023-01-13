import { APIClient } from "@open-decision/api-client";
import { FetchResponse } from "@open-decision/api-helpers";
import { TGetPublishedTreeOutput } from "@open-decision/api-specification";
import { useQuery } from "@tanstack/react-query";

export const publicTreesQueryKey = ["PublicTrees"] as const;
export const publicTreeQueryKey = (treeUuid: string) =>
  [...publicTreesQueryKey, treeUuid] as const;

export const usePublicTree = <
  TData = FetchResponse<Response, TGetPublishedTreeOutput>
>(
  uuid: string,
  options?: {
    staleTime?: number;
    select?: (data: FetchResponse<Response, TGetPublishedTreeOutput>) => TData;
  }
) => {
  return useQuery(
    publicTreeQueryKey(uuid),
    () => APIClient.trees.published.getSingle({ params: { uuid } }),
    options
  );
};
