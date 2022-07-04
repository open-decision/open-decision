import { ODError, ODProgrammerError, Tree } from "@open-decision/type-classes";
import * as React from "react";
import {
  createInterpreter,
  InterpreterService,
  createInterpreterMethods,
  InterpreterContext,
  InterpreterEvents,
  InterpreterOptions,
} from "@open-decision/interpreter";
import { useActor, useInterpret } from "@xstate/react";
import {
  InterpreterOptions as XStateInterpreteOptions,
  StateConfig,
} from "xstate";
import { UseMachineOptions } from "@xstate/react/lib/types";

function useInterpreterMachine(tree: Tree.TTree, options: InterpreterOptions) {
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
  config?: XStateInterpreteOptions &
    UseMachineOptions<InterpreterContext, InterpreterEvents>;
  onChange?: (
    state: StateConfig<InterpreterContext, InterpreterEvents>
  ) => void;
} & InterpreterOptions;

export function InterpreterProvider({
  children,
  tree,
  config,
  onChange,
  ...options
}: InterpreterProviderProps) {
  const interpreterMachine = useInterpreterMachine(tree, options);

  const service = useInterpret(
    interpreterMachine,
    { ...config, devTools: true },
    onChange
  );

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
