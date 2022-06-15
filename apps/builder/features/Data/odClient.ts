import { client } from "@open-decision/tree-api-specification";
import { useAuth } from "../Auth/useAuth";

export const useOD = () => {
  const [{ context }] = useAuth();

  return client({
    urlPrefix: "/external-api",
    headers: { authorization: `Bearer ${context.auth?.access.token}` },
  });
};
