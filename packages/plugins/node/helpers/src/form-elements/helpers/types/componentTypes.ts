import { Input } from "..";
import { z } from "zod";

export type InputComponentProps = {
  inputId: string;
};

export type InputPrimaryActionSlotProps = {
  inputId: string;
};

export type RendererComponentProps = {
  inputId: string;
  onSubmit?: (values: Record<string, string | string[]>) => void;
  className?: string;
  children?: React.ReactNode;
};

export const mergeTypes = <
  TDataType extends z.ZodType,
  TTypeName extends string
>(
  DataType: TDataType,
  typeName: TTypeName
) => Input.Type.extend({ data: DataType, type: z.literal(typeName) });

export type BuilderComponent = (
  props: InputComponentProps
) => JSX.Element | null;

export type BuilderPrimaryActionSlotComponent = (
  props: InputPrimaryActionSlotProps
) => JSX.Element;

export type RendererComponent = (props: RendererComponentProps) => JSX.Element;
