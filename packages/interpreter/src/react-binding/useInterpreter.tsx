import { Tree } from "@open-decision/type-classes";
import * as React from "react";
import { proxy, useSnapshot } from "valtio";
import { Interpreter } from "../interpreter";

type Context = {
  interpreter: Interpreter;
} & ReturnType<typeof Tree.createTreeMethods>;

const InterpreterContext = React.createContext<Context | null>(null);

export function InterpreterProvider({
  children,
  tree,
}: {
  children: React.ReactNode;
  tree: Tree.TTree;
}) {
  const interpreter = React.useRef(proxy(new Interpreter(tree)));
  const treeMethods = Tree.createTreeMethods(tree);

  return (
    <InterpreterContext.Provider
      value={{ interpreter: interpreter.current, ...treeMethods }}
    >
      {children}
    </InterpreterContext.Provider>
  );
}

export function useInterpreter() {
  const context = React.useContext(InterpreterContext);

  if (!context)
    throw new Error(
      `useInterpreter can only be used inside of an InterpreterProvider`
    );

  return { snapshot: useSnapshot(context.interpreter), ...context };
}
