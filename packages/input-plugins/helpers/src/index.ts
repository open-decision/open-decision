import { Input, TTreeClient } from "@open-decision/tree-sync";

export type InputComponentProps<TInput extends Input.TInput> = {
  nodeId: string;
  input: TInput;
  onClick: (target: string) => void;
  treeClient: TTreeClient;
};

export type InputPrimaryActionSlotProps<TInput extends Input.TInput> = {
  treeClient: TTreeClient;
  input: TInput;
};

export type RendererComponentProps<TInput> = {
  inputs: Record<string, TInput>;
  onSubmit: (values: Record<string, string>) => void;
};

export * from "./InputPlugin";
