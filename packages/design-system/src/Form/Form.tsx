/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled, StyleObject } from "../stitches";

import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";

const StyledForm = styled("form", {});

export type FormProps<TFieldValues> = {
  css?: StyleObject;
  children:
    | React.ReactNode
    | ((methods: UseFormReturn<TFieldValues>) => JSX.Element);
  onSubmit: SubmitHandler<TFieldValues>;
  onSubmitError?: SubmitErrorHandler<TFieldValues>;
} & UseFormProps<TFieldValues>;

export function Form<TFieldValues>({
  children,
  onSubmit,
  onSubmitError,
  css,
  ...props
}: FormProps<TFieldValues>) {
  const methods = useForm<TFieldValues>(props);

  return (
    <FormProvider {...methods}>
      <StyledForm
        onSubmit={methods.handleSubmit(onSubmit, onSubmitError)}
        css={css}
      >
        {children}
      </StyledForm>
    </FormProvider>
  );
}
