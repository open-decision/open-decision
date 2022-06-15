import * as React from "react";
import { styled } from "../stitches";

import {
  useForm as useReactHookForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  FieldPath,
} from "react-hook-form";

const StyledForm = styled("form", {
  gap: "$2",
  display: "flex",
  flexDirection: "column",
});

export type FormProps<TFieldValues extends object> = Omit<
  React.ComponentProps<typeof StyledForm>,
  "onSubmit"
> & {
  children:
    | React.ReactNode
    | ((methods: UseFormReturn<TFieldValues>) => JSX.Element);
  onSubmit?: SubmitHandler<TFieldValues>;
  onSubmitError?: SubmitErrorHandler<TFieldValues>;
} & { config?: UseFormProps<TFieldValues> };

export function useForm<TFieldValues extends FieldValues>(
  parameters?: UseFormProps<TFieldValues>
) {
  const methods = useReactHookForm<TFieldValues, FieldPath<TFieldValues>>(
    parameters
  );

  const Form = React.useCallback(
    function Form({
      children,
      onSubmit = () => null,
      onSubmitError,
      ...props
    }: FormProps<TFieldValues>) {
      return (
        <FormProvider {...methods}>
          <StyledForm
            onSubmit={methods.handleSubmit(onSubmit, onSubmitError)}
            {...props}
          >
            {typeof children === "function" ? children?.(methods) : children}
          </StyledForm>
        </FormProvider>
      );
    },
    [methods]
  );

  return [
    Form,
    {
      ...methods,
      handleSubmit:
        (
          onSubmit: SubmitHandler<TFieldValues>,
          onSubmitError?: SubmitErrorHandler<TFieldValues>
        ) =>
        (event?: React.BaseSyntheticEvent) =>
          methods.handleSubmit(onSubmit, onSubmitError)(event),
    },
  ] as const;
}
