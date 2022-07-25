import { useQuery } from "@tanstack/react-query";
import { proxiedOD } from "./odClient";
import { treesQueryKey } from "./useTreesQuery";

export const treeQueryKey = (treeUuid: string) => [
  "Tree",
  ...treesQueryKey,
  treeUuid,
];
export function useTreeQuery(uuid: string) {
  return useQuery(
    treeQueryKey(uuid),
    () => proxiedOD.trees.getSingle({ params: { uuid } }),
    {
      suspense: true,
      select(response) {
        return response.data;
      },
    }
  );
}
