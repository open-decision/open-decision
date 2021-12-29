/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled, StyleObject } from "../stitches";

import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
  UseFormProps,
  UnpackNestedValue,
  DeepPartial,
} from "react-hook-form";

const StyledForm = styled("form", {});

export type FormProps<TFieldValues> = {
  css?: StyleObject;
  children: React.ReactNode;
  onSubmit: SubmitHandler<TFieldValues>;
  onSubmitError?: SubmitErrorHandler<TFieldValues>;
  onChange?: (data: UnpackNestedValue<DeepPartial<TFieldValues>>) => void;
} & UseFormProps<TFieldValues>;

export function Form<TFieldValues>({
  children,
  onSubmit,
  onSubmitError,
  onChange,
  css,
  ...props
}: FormProps<TFieldValues>) {
  const methods = useForm<TFieldValues>(props);

  React.useEffect(() => {
    if (onChange) {
      const subscription = methods.watch((data) => onChange(data));
      return () => subscription.unsubscribe();
    }

    return undefined;
  }, [methods, onChange]);

  return (
    <FormProvider {...methods}>
      <StyledForm
        onSubmit={methods.handleSubmit(onSubmit, onSubmitError)}
        noValidate
        css={css}
      >
        {children}
      </StyledForm>
    </FormProvider>
  );
}
