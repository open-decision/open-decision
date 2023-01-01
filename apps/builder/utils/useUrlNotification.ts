import * as React from "react";
import { useRouter } from "next/router";
import { addNotification } from "@open-decision/design-system";

export function useUrlNotification() {
  const {
    query: { notify },
  } = useRouter();

  React.useEffect(() => {
    if (notify && typeof notify === "string") {
      addNotification(notify as any);
    }
  }, [notify]);
}
