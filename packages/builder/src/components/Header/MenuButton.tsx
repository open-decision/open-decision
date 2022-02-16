import * as React from "react";
import { Button, ButtonProps, Icon } from "@open-legal-tech/design-system";
import { ChevronDown } from "react-feather";
type Props = { label: string } & ButtonProps;

function MenuButtonImpl({ label, css, ...props }: Props, ref) {
  return (
    <Button
      variant="ghost"
      size="small"
      css={{
        minWidth: "max-content",
        color: "$gray11",

        "&[data-state='open'] svg": {
          transform: "rotate(180deg)",
        },
        ...css,
      }}
      ref={ref}
      {...props}
    >
      {label}
      <Icon
        css={{
          marginTop: "2px",
          "& svg": {
            transition: "transform 200ms ease-in-out",
          },
        }}
      >
        <ChevronDown />
      </Icon>
    </Button>
  );
}

export const MenuButton = React.forwardRef(MenuButtonImpl);
