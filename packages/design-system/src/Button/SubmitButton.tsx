import * as React from "react";
import { ColorKeys } from "../internal/utils";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { Button, ButtonProps } from "../Button/Button";

export type SubmitButtonProps = ButtonProps & {
  isLoading?: boolean;
  colorScheme?: ColorKeys;
};

export const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  SubmitButtonProps
>(function SubmitButton(
  { isLoading = false, children, colorScheme = "primary", className, ...props },
  ref
) {
  return (
    <Button
      type="submit"
      className={`colorScheme-${colorScheme} ${className}`}
      ref={ref}
      variant="primary"
      {...props}
    >
      {isLoading ? <LoadingSpinner colorScheme={colorScheme} /> : children}
    </Button>
  );
});
