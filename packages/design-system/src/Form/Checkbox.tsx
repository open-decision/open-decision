import * as CheckboxPrimitive from "ariakit/checkbox";
import * as React from "react";
import { styled } from "../stitches";

import { baseInputBoxStyles, baseInputStyles } from "./shared/styles";
import { VisuallyHidden } from "ariakit/visually-hidden";
import { Box } from "../Box";

const StyledCheckbox = styled(Box, baseInputStyles, baseInputBoxStyles, {
  boxSizing: "border-box",
  borderRadius: "$md",
  padding: "2px",
});

export type CheckboxProps = CheckboxPrimitive.CheckboxStateProps<boolean> &
  Omit<CheckboxPrimitive.CheckboxProps, "name">;
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Box({ defaultValue, value, setValue, ...props }, ref) {
    const checkbox = CheckboxPrimitive.useCheckboxState<boolean>({
      defaultValue,
      setValue,
      value,
    });

    const [focusVisible, setFocusVisible] = React.useState(false);

    return (
      <label>
        <VisuallyHidden>
          <CheckboxPrimitive.Checkbox
            state={checkbox}
            onFocusVisible={() => setFocusVisible(true)}
            onBlur={() => setFocusVisible(false)}
            ref={ref}
            {...props}
          />
        </VisuallyHidden>
        <StyledCheckbox
          data-checked={checkbox.value}
          data-focus-visible={focusVisible ? "" : null}
        >
          <CheckboxPrimitive.CheckboxCheck checked={checkbox.value} />
        </StyledCheckbox>
      </label>
    );
  }
);
