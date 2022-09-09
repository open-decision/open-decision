import { Tree } from "@open-decision/type-classes";

export type BuilderComponentProps<TInput> = {
  nodeId: string;
  input: TInput;
  onClick: (target: string) => void;
  tree: Tree.TTree;
};

export type BuilderPrimaryActionSlotProps<TInput> = {
  tree: Tree.TTree;
  input: TInput;
};

export type RendererComponentProps<TInput> = {
  inputs: Record<string, TInput>;
  onSubmit: (values: Record<string, string>) => void;
};
