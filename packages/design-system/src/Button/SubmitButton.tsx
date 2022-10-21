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
  { isLoading = false, children, colorScheme = "primary", css, ...props },
  ref
) {
  return (
    <Button
      type="submit"
      css={{
        focusColor: colorScheme ? `$${colorScheme}11` : undefined,
        colorScheme,
        ...css,
      }}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner colorScheme={colorScheme} size="1.4em" />
      ) : (
        children
      )}
    </Button>
  );
});
