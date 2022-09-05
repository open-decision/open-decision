import { ODProgrammerError } from "@open-decision/type-classes";
import * as React from "react";

export const MessagesContext = React.createContext<null | IntlMessages>(null);

export const useMessages = () => {
  const context = React.useContext(MessagesContext);

  if (!context) {
    throw new ODProgrammerError({
      code: "MISSING_CONTEXT_PROVIDER",
      message:
        "The messages context provider is not wrapped around this part of the tree.",
    });
  }

  return context;
};
