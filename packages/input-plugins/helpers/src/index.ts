import { Input, TBaseTreeClient } from "@open-decision/type-classes";

export type InputComponentProps<TInput extends Input.TBaseInput> = {
  nodeId: string;
  input: TInput;
  onClick: (target: string) => void;
  treeClient: TBaseTreeClient;
};

export type InputPrimaryActionSlotProps<TInput extends Input.TBaseInput> = {
  treeClient: TBaseTreeClient;
  input: TInput;
};

export type RendererComponentProps<TInput> = {
  inputs: Record<string, TInput>;
  onSubmit: (values: Record<string, string>) => void;
};
