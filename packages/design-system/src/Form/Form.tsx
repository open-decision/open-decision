/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled, StyleObject } from "../stitches";
import { isEmptyObject } from "../internal/utils";

import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
  UseFormProps,
  UnpackNestedValue,
} from "react-hook-form";

const StyledForm = styled("form", {});

export type FormProps<TFieldValues> = {
  css?: StyleObject;
  children: React.ReactNode;
  onSubmit: SubmitHandler<TFieldValues>;
  onSubmitError?: SubmitErrorHandler<TFieldValues>;
  onChange?: SubmitHandler<TFieldValues>;
  onChangeError?: SubmitErrorHandler<TFieldValues>;
} & UseFormProps<TFieldValues>;

export function Form<TFieldValues>({
  children,
  onSubmit,
  onSubmitError,
  onChange,
  onChangeError,
  css,
  ...props
}: FormProps<TFieldValues>) {
  const methods = useForm<TFieldValues>(props);
  const { watch, handleSubmit, formState } = methods;
  const { errors } = formState;

  React.useEffect(() => {
    if (!onChange) return undefined;
    const subscription = watch((data) => {
      if (!isEmptyObject(errors)) return onChangeError?.(errors);
      return onChange(data as UnpackNestedValue<TFieldValues>);
    });

    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, onChange, onChangeError, errors]);

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
