/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { mapValues } from "remeda";
import { styled } from "../stitches";

import type { FormStateValue, FormStateValuesList } from "./types";
import { FormProvider } from "./useForm";
import { useDeepCompareEffect } from "react-use";

const StyledForm = styled("form", {});

export type FormInput<TValue extends FormStateValue> = {
  value: TValue;
  errors: string[];
  blur: boolean;
};

export type FormState<TValues extends FormStateValuesList> = {
  values: TValues;
  errors: {
    [Property in keyof TValues]: { validated: boolean; errors: string[] };
  };
  blur: { [Property in keyof TValues]: boolean };
  visible: { [Property in keyof TValues]: boolean };
};

function createInitialFormState<TValues extends FormStateValuesList>(
  initialValues: TValues,
  visible?: Partial<Record<keyof TValues, boolean>>
): FormState<TValues> {
  return {
    values: initialValues,
    errors: mapValues(initialValues, () => ({
      validated: false,
      errors: [],
    })),
    blur: mapValues(initialValues, () => false),
    visible: mapValues(initialValues, (_, key) => visible?.[key] ?? true),
  };
}

export type FormProps<TValues extends FormStateValuesList> = Omit<
  React.ComponentProps<typeof StyledForm>,
  "onSubmit" | "onChange"
> & {
  onSubmit?: (data: FormState<TValues>) => void;
  onChange?: (data: FormState<TValues>) => void;
  initialValues: TValues;
  visible?: Partial<Record<keyof TValues, boolean>>;
};

type Status =
  | "unsubmitted"
  | "submitting"
  | "failedValidation"
  | "validated"
  | "submitted";

export function Form<TValues extends FormStateValuesList>({
  children,
  initialValues,
  onSubmit,
  onChange,
  visible,
  ...props
}: FormProps<TValues>) {
  const [data, setData] = React.useState(
    createInitialFormState(initialValues, visible)
  );

  useDeepCompareEffect(() => {
    setData(createInitialFormState(initialValues, visible));
  }, [initialValues]);

  const [status, setStatus] = React.useState<Status>("unsubmitted");

  React.useEffect(() => {
    if (status === "submitting") {
      const errors = Object.entries(data.errors).filter(
        ([key]) => visible?.[key] ?? true
      );

      const allValidated = errors
        .map(([, error]) => error.validated)
        .some((validated) => validated);

      const noErrors = errors.flatMap(([, error]) => error.errors).length === 0;

      if (noErrors && allValidated) {
        setStatus("validated");
      } else {
        setStatus("failedValidation");
      }
    }
  }, [data.errors]);

  React.useEffect(() => {
    if (status === "validated") {
      onSubmit?.(data);
      setStatus("submitted");
    }
  }, [status]);

  return (
    <FormProvider
      value={{
        ...data,
        submitting: status === "submitting",
        setValue: (name) => (newValue) => {
          const newState = {
            ...data,
            values: {
              ...data.values,
              [name]: newValue,
            },
          } as FormState<TValues>;

          onChange?.(newState);
          setData(newState);
        },
        setErrors: (name) => (errors) => {
          const newState = {
            ...data,
            errors: {
              ...data.errors,
              [name]: { validated: true, errors },
            },
          } as FormState<TValues>;

          onChange?.(newState);
          setData(newState);
        },
        setBlur: (name) => (newBlur) => {
          const newState = {
            ...data,
            blur: {
              ...data.blur,
              [name]: newBlur,
            },
          } as FormState<TValues>;

          onChange?.(newState);
          setData(newState);
        },
      }}
    >
      <StyledForm
        onSubmit={(event) => {
          event.preventDefault();
          setStatus("submitting");
        }}
        noValidate
        {...props}
      >
        {children}
      </StyledForm>
    </FormProvider>
  );
}
