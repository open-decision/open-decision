import * as React from "react";
import { Button, ButtonProps, Icon } from "@open-decision/design-system";
import { ChevronDown } from "react-feather";
type Props = { label: React.ReactNode } & ButtonProps;

function MenuButtonImpl({ label, css, ...props }: Props, ref) {
  return (
    <Button
      variant="neutral"
      css={{
        minWidth: "max-content",

        "&[data-state='open'] .rotate": {
          transform: "rotate(180deg)",
        },
        ...css,
      }}
      ref={ref}
      {...props}
    >
      {label}
      <Icon
        className="rotate"
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
