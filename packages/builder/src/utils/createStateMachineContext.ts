import { useSelector } from "@xstate/react";
import * as React from "react";
import { Interpreter } from "xstate";

export function createInterpreterContext<
  TInterpreter extends Interpreter<any, any, any, any, any>
>(displayName: string) {
  const [Provider, useContext] =
    createRequiredContext<TInterpreter>(displayName);

  function createUseSelector<Data>(
    selector: (state: TInterpreter["state"]) => Data
  ) {
    return () => {
      return useSelector(useContext(), selector);
    };
  }

  return [Provider, useContext, createUseSelector] as const;
}

function createRequiredContext<T extends Interpreter<any, any, any, any, any>>(
  displayName: string
) {
  const context = React.createContext<T | null>(null);
  context.displayName = displayName;

  function useContext() {
    const ctx = React.useContext(context);
    if (!ctx) {
      throw new Error(
        `use${displayName} must be used inside ${displayName}Provider`
      );
    }

    return ctx;
  }

  return [context.Provider, useContext] as const;
}
