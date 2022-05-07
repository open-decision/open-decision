import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import { styled } from "../stitches";

import { baseInputBoxStyles, baseInputStyles } from "./shared/styles";
import { CheckIcon } from "@radix-ui/react-icons";

const Indicator = styled(CheckboxPrimitive.Indicator, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledCheckbox = styled(
  CheckboxPrimitive.Root,
  baseInputStyles,
  baseInputBoxStyles,
  {
    boxSizing: "border-box",
    borderRadius: "$md",
    padding: "4px",
  }
);

export type CheckboxProps = React.ComponentProps<typeof StyledCheckbox>;

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  function Box(props, ref) {
    return (
      <StyledCheckbox {...props} ref={ref}>
        <Indicator>
          <CheckIcon width="100%" height="100%" />
        </Indicator>
      </StyledCheckbox>
    );
  }
);
