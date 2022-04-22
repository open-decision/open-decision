import { ODError, ODProgrammerError, Tree } from "@open-decision/type-classes";
import * as React from "react";
import { createInterpreter, InterpreterService } from "../interpreter";
import { useActor, useInterpret } from "@xstate/react";
import { createInterpreterMethods } from "../methods";

function useInterpreterMachine(tree: Tree.TTree) {
  const interpreterMachine = createInterpreter(tree);

  if (interpreterMachine instanceof ODError) throw interpreterMachine;

  return interpreterMachine;
}

const InterpreterContext = React.createContext<InterpreterService | null>(null);

export function InterpreterProvider({
  children,
  tree,
}: {
  children: React.ReactNode;
  tree: Tree.TTree;
}) {
  const interpreterMachine = useInterpreterMachine(tree);

  const service = useInterpret(interpreterMachine, {
    devTools: true,
  });

  return (
    <InterpreterContext.Provider value={service}>
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
  const service = useInterpreterService();

  const [state, send] = useActor(service);

  const methods = React.useMemo(() => {
    return createInterpreterMethods(state.context);
  }, [state.context]);

  return { state, send, ...methods };
}
