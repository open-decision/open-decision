/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled, StyleObject } from "../stitches";

import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
  FieldValues,
} from "react-hook-form";

const StyledForm = styled("form", {});

export type FormProps = {
  css?: StyleObject;
  children: React.ReactNode;
  onSubmit: SubmitHandler<FieldValues>;
  onSubmitError?: SubmitErrorHandler<FieldValues>;
};

export function Form({ children, onSubmit, css }: FormProps) {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <StyledForm
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        css={css}
      >
        {children}
      </StyledForm>
    </FormProvider>
  );
}
