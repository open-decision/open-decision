/* eslint-disable react/jsx-props-no-spreading */
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as React from "react";
import { Stack } from "@open-decision/design-system/src/Layout";
import { styled } from "@open-decision/design-system/src/stitches";

import { baseInputBoxStyles, baseInputStyles } from "@open-decision/design-system/src/Form/shared/styles";

const StyledRadio = styled(
  RadioGroup.Item,
  baseInputStyles,
  baseInputBoxStyles,
  { borderRadius: "$full" }
);

const Indicator = styled(RadioGroup.Indicator, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&::after": {
    content: '""',
    display: "block",
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "white",
  },
});

export type ItemProps = React.ComponentProps<typeof StyledRadio>;

export const Item = React.forwardRef<HTMLButtonElement, ItemProps>(
  function RadioItem(props, ref) {
    return (
      <StyledRadio ref={ref} {...props}>
        <Indicator />
      </StyledRadio>
    );
  }
);

export const Root = styled(RadioGroup.Root, Stack, { gap: "$2" });

export type RootProps = RadioGroup.RadioGroupProps;
