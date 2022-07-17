import { useQuery } from "react-query";
import { proxiedOD } from "./odClient";

export const useTreesQueryKey = "Trees";
export function useTreesQuery() {
  return useQuery(
    useTreesQueryKey,
    () => {
      return proxiedOD.trees.getCollection({});
    },
    {
      select({ data }) {
        return data.map((tree) => ({
          ...tree,
          status: tree.publishedTrees.length > 0 ? "PUBLISHED" : tree.status,
        }));
      },
    }
  );
}
