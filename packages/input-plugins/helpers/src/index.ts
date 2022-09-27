import { Input, TTreeClient } from "@open-decision/tree-type";
import { StyleObject } from "@open-decision/design-system";
import { z } from "zod";

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
  input: TInput;
  onSubmit?: (values: Record<string, string>) => void;
  css?: StyleObject;
  children: React.ReactNode;
};

export * from "./InputPlugin";

export const mergeTypes = <
  TDataType extends z.ZodType,
  TTypeName extends string
>(
  DataType: TDataType,
  typeName: TTypeName
) => Input.Type.extend({ data: DataType, type: z.literal(typeName) });
