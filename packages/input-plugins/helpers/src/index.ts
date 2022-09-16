import { Input, TTreeClient } from "@open-decision/type-classes";

export type InputComponentProps<TInput extends Input.TBaseInput> = {
  nodeId: string;
  input: TInput;
  onClick: (target: string) => void;
  treeClient: TTreeClient;
};

export type InputPrimaryActionSlotProps<TInput extends Input.TBaseInput> = {
  treeClient: TTreeClient;
  input: TInput;
};

export type RendererComponentProps<TInput> = {
  inputs: Record<string, TInput>;
  onSubmit: (values: Record<string, string>) => void;
};
