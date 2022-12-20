import { FetchJSONReturn } from "@open-decision/api-helpers";
import { TGetPublishedTreeOutput } from "@open-decision/api-specification";
import { useQuery } from "@tanstack/react-query";
import { OD } from "./odClient";

export const publicTreesQueryKey = ["PublicTrees"] as const;
export const publicTreeQueryKey = (treeUuid: string) =>
  [...publicTreesQueryKey, treeUuid] as const;

export const usePublicTree = <TData = FetchJSONReturn<TGetPublishedTreeOutput>>(
  uuid: string,
  options?: {
    staleTime?: number;
    select?: (data: FetchJSONReturn<TGetPublishedTreeOutput>) => TData;
  }
) => {
  return useQuery(
    publicTreeQueryKey(uuid),
    () => OD.publishedTrees.getSingle({ params: { uuid } }),
    options
  );
};
