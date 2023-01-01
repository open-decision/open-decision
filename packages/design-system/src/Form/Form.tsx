import { twMerge } from "../utils";
import { errorMessageClasses, ErrorMessageProps } from "../Error/ErrorMessage";
import {
  FieldValues,
  FormProvider,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

export type { FieldValues } from "react-hook-form";

// ------------------------------------------------------------------
// Root

const rootClasses = "gap-2 flex flex-col";
export type RootProps<TFieldValues extends FieldValues> =
  React.FormHTMLAttributes<HTMLFormElement> & {
    methods: UseFormReturn<TFieldValues>;
  };

export function Root<TFieldValues extends FieldValues>({
  children,
  className,
  methods,
  ...props
}: RootProps<TFieldValues>) {
  return (
    <FormProvider {...methods}>
      <form
        className={className ? twMerge(rootClasses, className) : rootClasses}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

// ------------------------------------------------------------------
// Checkbox
export * from "./Checkbox";

// ------------------------------------------------------------------
// Inputs

export * from "./Inputs";

// ------------------------------------------------------------------
// Label

export { Label } from "../Label/Label";

// ------------------------------------------------------------------
// Error

export type ErrorProps = ErrorMessageProps & { name: string };

export const Error = ({ className, size, name, ...props }: ErrorProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <span className={errorMessageClasses({ size }, [className])} {...props}>
          {message}
        </span>
      )}
    />
  );
};

// ------------------------------------------------------------------
// RadioButton

export * from "./RadioButton";

// ------------------------------------------------------------------
// Submit

export * from "../Button/SubmitButton";

// ------------------------------------------------------------------

export * from "./Field/Field";

export { useForm, useFormContext } from "react-hook-form";
