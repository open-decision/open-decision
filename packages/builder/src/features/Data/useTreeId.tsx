import { useRouter } from "next/router";

export function useTreeId() {
  const {
    query: { id },
  } = useRouter();

  if (!id || typeof id !== "string") {
    throw new Error(`The url does not contain a valid tree id`);
  }

  return id;
}
