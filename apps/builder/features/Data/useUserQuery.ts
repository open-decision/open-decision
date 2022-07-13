import { useQuery } from "react-query";
import { proxiedOD } from "./odClient";

export const useUserQueryKey = "user";
export function useUserQuery() {
  return useQuery(
    [useUserQueryKey],
    async () => {
      return await (
        await proxiedOD.user.getUser({})
      ).data;
    },
    {
      staleTime: Infinity,
    }
  );
}
