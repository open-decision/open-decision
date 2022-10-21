import { StyleObject } from "@open-decision/design-system";
import { z } from "zod";
import { InputPlugin } from "./InputPlugin";
import * as Input from "./Input";
import { BaseVariableType } from "@open-decision/variable-plugins-helpers";
import { Node } from "@open-decision/tree-type";

export { Input };

export type InputComponentProps<TInput extends Input.TInput> = {
  nodeId: string;
  input: TInput;
  onTargetSelect: (target: string) => void;
  onNodeCreate: (
    nodeData: Partial<Omit<Node.TNode, "id" | "data" | "type">>
  ) => Node.TNode;
};

export type InputPrimaryActionSlotProps<TInput extends Input.TInput> = {
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

export type BuilderComponent<TInput extends Input.TInput> = (
  props: InputComponentProps<TInput>
) => JSX.Element;

export type BuilderPrimaryActionSlotComponent<TInput extends Input.TInput> = (
  props: InputPrimaryActionSlotProps<TInput>
) => JSX.Element;

export type RendererComponent<TInput extends Input.TInput> = (
  props: RendererComponentProps<TInput>
) => JSX.Element;

export type InputPluginObject<
  TType extends z.ZodType = any,
  TTypeName extends string = string,
  TInput extends Input.TInput = any,
  TVariableType extends typeof BaseVariableType = any
> = {
  plugin: InputPlugin<TType, TTypeName, TVariableType>;
  type: string;
  BuilderComponent: {
    InputConfigurator: BuilderComponent<TInput>;
    PrimaryActionSlot?: BuilderPrimaryActionSlotComponent<TInput>;
  };
  RendererComponent: RendererComponent<TInput>;
};

export * from "./utils";
