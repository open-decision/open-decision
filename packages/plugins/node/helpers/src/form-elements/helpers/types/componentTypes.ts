export type InputComponentProps = {
  inputId: string;
  withRequiredOption?: boolean;
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

export type BuilderComponent = (
  props: InputComponentProps
) => JSX.Element | null;

export type BuilderPrimaryActionSlotComponent = (
  props: InputPrimaryActionSlotProps
) => JSX.Element;

export type RendererComponent = (props: RendererComponentProps) => JSX.Element;
