import * as React from "react";
import { styled, darkTheme } from "../stitches";
import { Button as SystemButton, ButtonProps } from "./Button";
import * as ToggleGroupPrimitives from "@radix-ui/react-toggle-group";
import { activeSelector } from "../stitches/stateSelectors";

const StyledRoot = styled(ToggleGroupPrimitives.Root, {
  display: "inline-flex",
  borderRadius: "$md",
  layer: "3",
  padding: "$1",
  gap: "$1",

  [`.${darkTheme} &`]: {
    layer: "4",
  },

  variants: {
    variant: {
      raised: {
        boxShadow: "$1",
      },
      lowered: {},
    },
  },

  defaultVariants: {
    variant: "raised",
  },
});

export type RootProps = React.ComponentProps<typeof StyledRoot>;

export const Root = ({
  children,
  value,
  onValueChange,
  ...props
}: RootProps) => {
  return <StyledRoot {...props}>{children}</StyledRoot>;
};

export type ToggleItemProps = ToggleGroupPrimitives.ToggleGroupItemProps;
export type ToggleRootProps = React.ComponentProps<typeof Root>;
export type ToggleButtonProps = ButtonProps;

export const Item = ({ children, ...props }: ToggleItemProps) => {
  return (
    <ToggleGroupPrimitives.Item {...props}>
      {children}
    </ToggleGroupPrimitives.Item>
  );
};

const ButtonImpl = (
  { children, css, ...props }: ToggleButtonProps,
  ref: React.Ref<HTMLButtonElement>
) => (
  <SystemButton
    ref={ref}
    variant="neutral"
    pressable={false}
    size="small"
    css={{
      fontSize: "$medium-text",
      color: "$gray11",
      colorScheme: "primary",
      focusType: "outer",

      [`${activeSelector}`]: {
        color: "$white",
        backgroundColor: "$colorScheme9",
      },
      ...css,
    }}
    {...props}
  >
    {children}
  </SystemButton>
);

export const Button = React.forwardRef(ButtonImpl);
