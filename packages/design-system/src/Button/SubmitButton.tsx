import * as React from "react";
import { ColorKeys } from "@open-decision/design-system/src/internal/utils";
import { LoadingSpinner } from "@open-decision/design-system/src/LoadingSpinner/LoadingSpinner";
import { Button, ButtonProps } from "@open-decision/design-system/src/Button/Button";

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
