import * as React from "react";

type InputGroupTypes = "checkbox" | "radio";
type InputGroupContext =
  | {
      type: "radio" | "checkbox";
      name: string;
      getActive: (elemName: string) => boolean;
    }
  | undefined;

const InputGroupContext = React.createContext<InputGroupContext>(undefined);

export function useInputGroup(type: InputGroupTypes) {
  const context = React.useContext(InputGroupContext);

  if (!context) {
    throw new Error(
      "useInputGroup can only be called from inside of a Radio or Checkbox Group"
    );
  }

  if (type && context.type !== type) {
    throw new Error(
      "Checkboxes and Radio buttons cannot be mixed in one group."
    );
  }

  return context;
}

type ProviderProps = React.ComponentProps<typeof InputGroupContext.Provider>;

export function InputGroupProvider({ children, value }: ProviderProps) {
  return (
    <InputGroupContext.Provider value={value}>
      {children}
    </InputGroupContext.Provider>
  );
}
