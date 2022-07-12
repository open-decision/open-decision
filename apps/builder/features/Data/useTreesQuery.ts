import { useQuery } from "react-query";
import { useOD } from "./odClient";

export const useTreesQueryKey = "Trees";
export function useTreesQuery() {
  const OD = useOD();

  return useQuery(
    useTreesQueryKey,
    () => {
      return OD.trees.getCollection({});
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
