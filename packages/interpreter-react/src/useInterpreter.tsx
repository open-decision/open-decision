import { ODError, ODProgrammerError, Tree } from "@open-decision/type-classes";
import * as React from "react";
import {
  createInterpreter,
  InterpreterOptions,
  InterpreterService,
  createInterpreterMethods,
  InterpreterContext,
  InterpreterEvents,
} from "@open-decision/interpreter";
import { useActor, useInterpret } from "@xstate/react";
import { StateConfig } from "xstate";

function useInterpreterMachine(tree: Tree.TTree, options?: InterpreterOptions) {
  const interpreterMachine = createInterpreter(tree, options);

  if (interpreterMachine instanceof ODError) throw interpreterMachine;

  return interpreterMachine;
}

const InterpreterContext = React.createContext<{
  service: InterpreterService;
  tree: Tree.TTree;
} | null>(null);

export type InterpreterProviderProps = {
  children: React.ReactNode;
  tree: Tree.TTree;
  state?: StateConfig<InterpreterContext, InterpreterEvents>;
} & InterpreterOptions;

export function InterpreterProvider({
  children,
  tree,
  state,
  ...options
}: InterpreterProviderProps) {
  const interpreterMachine = useInterpreterMachine(tree, options);

  const service = useInterpret(interpreterMachine, { state });

  return (
    <InterpreterContext.Provider value={{ service, tree }}>
      {children}
    </InterpreterContext.Provider>
  );
}

export function useInterpreterService() {
  const service = React.useContext(InterpreterContext);

  if (!service)
    throw new ODProgrammerError({
      message:
        "useInterpreter or useInterpreterService can only be used inside of an InterpreterProvider",
      code: "MISSING_CONTEXT_PROVIDER",
    });

  return service;
}

export function useInterpreter() {
  const { service, tree } = useInterpreterService();

  const [state, send] = useActor(service);

  const methods = React.useMemo(() => {
    return createInterpreterMethods(state.context, tree);
  }, [state.context, tree]);

  return { state, send, tree, ...methods };
}
