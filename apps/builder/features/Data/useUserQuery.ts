import { useQuery } from "react-query";
import { proxiedOD } from "./odClient";

export const useUserQueryKey = "user";
export function useUserQuery() {
  return useQuery(
    [useUserQueryKey],
    async () => {
      return proxiedOD.user.getUser({});
    },
    {
      select: ({ data }) => data,
      staleTime: Infinity,
    }
  );
}
