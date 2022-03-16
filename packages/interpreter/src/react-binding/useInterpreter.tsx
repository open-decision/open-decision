import { BuilderTree } from "@open-decision/type-classes";
import * as React from "react";
import { proxy, useSnapshot } from "valtio";
import { Interpreter } from "../interpreter";

const InterpreterContext = React.createContext<Interpreter | null>(null);

export function InterpreterProvider({
  children,
  tree,
}: {
  children: React.ReactNode;
  tree: BuilderTree.TTree;
}) {
  const interpreter = React.useRef(proxy(new Interpreter(tree)));

  return (
    <InterpreterContext.Provider value={interpreter.current}>
      {children}
    </InterpreterContext.Provider>
  );
}

export function useInterpreter() {
  const interpreter = React.useContext(InterpreterContext);

  if (!interpreter)
    throw new Error(
      `useInterpreter can only be used inside of an InterpreterProvider`
    );

  return [useSnapshot(interpreter), interpreter];
}
