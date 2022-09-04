import { FetchReturn } from "@open-decision/api-helpers";
import { TGetPublishedTreeOutput } from "@open-decision/tree-api-specification";
import { useQuery } from "@tanstack/react-query";
import { proxiedOD } from "./odClient";

export const publicTreesQueryKey = ["PublicTrees"] as const;
export const publicTreeQueryKey = (treeUuid: string) =>
  [...publicTreesQueryKey, treeUuid] as const;

export const usePublicTree = <TData = FetchReturn<TGetPublishedTreeOutput>>(
  uuid: string,
  options?: {
    staleTime?: number;
    select?: (data: FetchReturn<TGetPublishedTreeOutput>) => TData;
  }
) => {
  return useQuery(
    publicTreeQueryKey(uuid),
    () => proxiedOD.publishedTrees.getSingle({ params: { uuid } }),
    options
  );
};
