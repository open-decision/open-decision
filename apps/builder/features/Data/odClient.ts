import {
  TAuthenticatedClient,
  TUnauthenticatedClient,
} from "@open-decision/api-client";
import { ODProgrammerError } from "@open-decision/type-classes";
import { useAuth } from "../Auth/useAuth";

export function useOD(type?: "authenticated"): TAuthenticatedClient;
export function useOD(type?: "unauthenticated"): TUnauthenticatedClient;
export function useOD(
  type: "unauthenticated" | "authenticated" = "authenticated"
): TAuthenticatedClient | TUnauthenticatedClient {
  const [
    {
      context: { client },
      matches,
    },
  ] = useAuth();

  if (!matches("loggedIn") && type === "authenticated")
    throw new ODProgrammerError({
      code: "UNAUTHENTICATED_API_CALL",
      message:
        "The authenticated OD client has been requested as authenticated while it was not. Please make sure that the user has loggedIn.",
    });

  if (type === "authenticated") return client;

  return client;
}
