import { useQuery } from "@tanstack/react-query";
import { proxiedOD } from "./odClient";

export const treesQueryKey = ["Trees"];
export function useTreesQuery() {
  return useQuery(treesQueryKey, () => proxiedOD.trees.getCollection({}), {
    suspense: true,
    select(response) {
      return response.data;
    },
  });
}
