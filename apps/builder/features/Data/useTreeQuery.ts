import { useQuery } from "react-query";
import { proxiedOD } from "./odClient";

export const useTreeQueryKey = "Tree";
export function useTreeQuery(uuid: string) {
  return useQuery(
    [useTreeQueryKey, uuid],
    async () => {
      return await proxiedOD.trees.getSingle({ params: { uuid } });
    },
    {
      select({ data }) {
        return {
          ...data,
          status: data.publishedTrees.length > 0 ? "PUBLISHED" : data.status,
        };
      },
    }
  );
}
