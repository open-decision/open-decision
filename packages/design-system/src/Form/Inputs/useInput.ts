import * as React from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { useComposedRefs } from "../../internal/utils";

type ControlledInputProps = {
  control?: true;
} & React.InputHTMLAttributes<HTMLInputElement>;

type UncontrolledInputProps = {
  control?: false;
} & RegisterOptions;

export type UseInputProps = UncontrolledInputProps | ControlledInputProps;

export function useInput(
  name: string,
  {
    control = false,
    ...options
  }: UncontrolledInputProps | ControlledInputProps,
  forwardedRef: React.Ref<HTMLInputElement>
) {
  const { register } = useFormContext();
  const { ref, ...inputProps } = control
    ? {
        ref: forwardedRef,
        ...(options as React.InputHTMLAttributes<HTMLInputElement>),
      }
    : register(name, {
        disabled: options.disabled,
        ...(options as RegisterOptions),
      });

  const innerRef = useComposedRefs(ref);

  const [hasFocus, setHasFocus] = React.useState(false);

  React.useEffect(() => {
    if (
      document.hasFocus() &&
      innerRef.current?.contains(document.activeElement)
    ) {
      setHasFocus(true);
    }
  }, [innerRef]);

  return {
    hasFocus,
    setHasFocus,
    ref: innerRef,
    inputProps,
  };
}
