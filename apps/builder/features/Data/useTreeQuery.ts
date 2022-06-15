import { useQuery } from "react-query";
import { useOD } from "../Data/odClient";

export const useTreeQueryKey = "Tree";
export function useTreeQuery(uuid: string) {
  const OD = useOD();

  return useQuery(
    [useTreeQueryKey, uuid],
    async () => {
      return await OD.trees.getSingle({ params: { uuid } });
    },
    {
      select(data) {
        return {
          ...data,
          status: data.publishedTrees.length > 0 ? "PUBLISHED" : data.status,
        };
      },
    }
  );
}
