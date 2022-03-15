import * as React from "react";
import { ColorKeys } from "../internal/utils";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { Button, ButtonProps } from "./Button";

export type SubmitButtonProps = ButtonProps & {
  isLoading: boolean;
  colorScheme?: ColorKeys;
};

export const SubmitButton = ({
  isLoading,
  children,
  colorScheme = "primary",
  css,
  ...props
}: SubmitButtonProps) => (
  <Button
    type="submit"
    css={{
      focusColor: colorScheme ? `$${colorScheme}11` : undefined,
      colorScheme,
      ...css,
    }}
    {...props}
  >
    {isLoading ? <LoadingSpinner colorScheme={colorScheme} /> : children}
  </Button>
);
