import { TInputId } from "../InputPlugin";

export type InputConfiguratorProps = {
  inputId: TInputId;
  withRequiredOption?: boolean;
};

export type InputPrimaryActionSlotProps = {
  inputId: TInputId;
};

export type InputRendererProps = {
  inputId: TInputId;
  onSubmit?: (values: Record<string, string | string[]>) => void;
  className?: string;
  children?: React.ReactNode;
};

export type InputConfigurator = (
  props: InputConfiguratorProps
) => JSX.Element | null;

export type InputPrimaryActionSlot = (
  props: InputPrimaryActionSlotProps
) => JSX.Element | null;

export type InputRenderer = (props: InputRendererProps) => JSX.Element | null;
