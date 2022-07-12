import { useQuery } from "react-query";
import { useOD } from "../Data/odClient";

export const useUserQueryKey = "user";
export function useUserQuery() {
  const OD = useOD();

  return useQuery(
    [useUserQueryKey],
    async () => {
      return await (
        await OD.user.getUser({})
      ).data;
    },
    {
      staleTime: Infinity,
    }
  );
}
