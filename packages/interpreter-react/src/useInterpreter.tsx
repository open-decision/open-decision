import { ODProgrammerError, Tree } from "@open-decision/type-classes";
import * as React from "react";
import {
  createInterpreterMachine,
  InterpreterService,
  createInterpreterMethods,
  InterpreterEvents,
  InterpreterOptions,
} from "@open-decision/interpreter";
import type { InterpreterContext } from "@open-decision/interpreter";
import { useActor, useInterpret } from "@xstate/react";
import { InterpreterOptions as XStateInterpreteOptions } from "xstate";
import { UseMachineOptions } from "@xstate/react/lib/types";
import { ErrorCard, Stack } from "@open-decision/design-system";

const MachineContext = React.createContext<{
  service: InterpreterService;
  tree: Tree.TTree;
} | null>(null);

export type InterpreterProviderProps = {
  children: React.ReactNode;
  tree: Tree.TTree;
  config?: XStateInterpreteOptions &
    UseMachineOptions<InterpreterContext, InterpreterEvents>;
  resolver: Parameters<typeof createInterpreterMachine>[2];
} & InterpreterOptions;

export function InterpreterProvider({
  children,
  tree,
  config,
  resolver,
  ...options
}: InterpreterProviderProps) {
  const [[interpreterMachine]] = React.useState(
    React.useState(createInterpreterMachine(tree, Tree.Type, resolver, options))
  );

  if (interpreterMachine instanceof Error)
    return (
      <Stack center css={{ height: "100%" }}>
        <ErrorCard error={interpreterMachine} css={{ maxWidth: "600px" }} />
      </Stack>
    );

  const service = useInterpret(interpreterMachine, config);

  return (
    <MachineContext.Provider
      value={{
        service,
        tree,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
}

export function useInterpreterService() {
  const context = React.useContext(MachineContext);

  if (!context)
    throw new ODProgrammerError({
      message:
        "useInterpreter or useInterpreterService can only be used inside of an InterpreterProvider",
      code: "MISSING_CONTEXT_PROVIDER",
    });

  return context;
}

export function useInterpreter() {
  const { service, tree } = useInterpreterService();

  const [state, send] = useActor(service);

  const methods = React.useMemo(() => {
    return createInterpreterMethods(state.context, tree);
  }, [state.context, tree]);

  return { state, send, tree, ...methods };
}
