import * as React from 'react';

import type { FormState } from './Form';
import type { FormStateValue, FormStateValuesList, RecordValue } from './types';

type Context<TValues extends FormStateValuesList> = FormState<TValues> & {
  setValue: <TType extends FormStateValue>(
    name: keyof TValues,
  ) => (newValue: TType) => void;
  setErrors: (name: keyof TValues) => (errors: string[]) => void;
  setBlur: (name: keyof TValues) => (newBlur: boolean) => void;
  submitting: boolean;
};

function createFormContext<TValues extends FormStateValuesList>() {
  return React.createContext<Context<TValues> | null>(null);
}

export const FormContext = createFormContext();

export function useForm() {
  const context = React.useContext(FormContext);

  if (!context) {
    throw new Error(
      'Inputs with useForm can only be used inside of a Form Component',
    );
  }

  return context;
}

type InputState<TValue extends FormStateValue> = {
  submitting: boolean;
  value: TValue;
  errors: string[];
  blur: boolean;
  setValue: (newValue: TValue) => void;
  setErrors: (errors: string[]) => void;
  setBlur: (newBlur: boolean) => void;
};

type createId = (elemName: string) => string;
export function useInput(name: string, type?: 'string'): InputState<string>;
export function useInput(
  name: string,
  type?: 'object',
): InputState<RecordValue> & createId;
export function useInput(name: string, type?: 'string' | 'object') {
  const context = useForm();

  if (!(name in context.values)) {
    throw new Error(
      'The name provided to the input does not exist on the initialValues object of the Form',
    );
  }

  const inputValue = context.values[name];
  const inputErrors = context.errors[name].errors;
  const inputBlur = context.blur[name];

  if (type === 'string' && typeof inputValue === 'string') {
    return {
      submitting: context.submitting,
      value: inputValue,
      errors: inputErrors,
      blur: inputBlur,
      setValue: context.setValue<string>(name),
      setErrors: context.setErrors(name),
      setBlur: context.setBlur(name),
    } as InputState<string>;
  }

  if (type === 'object' && typeof inputValue === 'object') {
    return {
      submitting: context.submitting,
      value: inputValue,
      errors: inputErrors,
      blur: inputBlur,
      setValue: context.setValue<RecordValue>(name),
      setErrors: context.setErrors(name),
      setBlur: context.setBlur(name),
      createId: (elemName: string) => `${name}-${elemName}`,
    } as InputState<RecordValue>;
  }

  return {
    submitting: context.submitting,
    value: inputValue,
    errors: inputErrors,
    blur: inputBlur,
    setValue: context.setValue<RecordValue | string>(name),
    setErrors: context.setErrors(name),
    setBlur: context.setBlur(name),
  } as InputState<RecordValue | string>;
}

type FormProviderProps = React.ComponentProps<typeof FormContext.Provider>;

export function FormProvider({ value, children, ...props }: FormProviderProps) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormContext.Provider value={value} {...props}>
      {children}
    </FormContext.Provider>
  );
}
