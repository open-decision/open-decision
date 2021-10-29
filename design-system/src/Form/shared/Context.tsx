import * as React from 'react';

type InputGroupTypes = 'checkbox' | 'radio';
type RadioContext = {
  type: 'radio';
  name: string;
  activeItems: string[];
  getActive: (elemName: string) => boolean;
  createId: (elemValue: string) => string;
};
type CheckboxContext = {
  type: 'checkbox';
  name: string;
  activeItems: string[];
  getActive: (elemName: string) => boolean;
  values: Record<string, boolean>;
  createId: (elemValue: string) => string;
};

type InputGroupContext = RadioContext | CheckboxContext | undefined;

const InputGroupContext = React.createContext<InputGroupContext>(undefined);

export function useInputGroup(type?: 'radio'): RadioContext;
export function useInputGroup(type?: 'checkbox'): CheckboxContext;
export function useInputGroup(type?: InputGroupTypes) {
  const context = React.useContext(InputGroupContext);

  if (!context) {
    throw new Error(
      'useInputGroup can only be called from inside of a Radio or Checkbox Group',
    );
  }

  if (type && context.type !== type) {
    throw new Error(
      'Checkboxes and Radio buttons cannot be mixed in one group.',
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
