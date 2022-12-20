import * as React from "react";
import { twMerge } from "../../utils";
import {
  baseInputClasses,
  BaseInputVariants,
  textInputClasses,
  TextInputVariants,
} from "../shared/shared";

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  BaseInputVariants &
  TextInputVariants;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function Textarea({ variant, size, className, ...props }, ref) {
    return (
      <textarea
        className={twMerge(
          baseInputClasses({ variant }),
          textInputClasses({ size }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
