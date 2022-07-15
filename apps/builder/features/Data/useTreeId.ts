import { ODProgrammerError } from "@open-decision/type-classes";
import { useRouter } from "next/router";

export function useTreeId() {
  const { query } = useRouter();

  if (query.id && typeof query.id !== "string") {
    throw new ODProgrammerError({
      code: "MISSING_URL_PARTS",
      message: `The url does not contain a valid tree id`,
    });
  }

  return query.id;
}
