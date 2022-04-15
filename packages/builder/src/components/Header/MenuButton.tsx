import * as React from "react";
import { Button, ButtonProps, Icon } from "@open-decision/design-system";
import { TriangleDownIcon } from "@radix-ui/react-icons";
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
          "& svg": {
            transition: "transform 200ms ease-in-out",
          },
        }}
      >
        <TriangleDownIcon />
      </Icon>
    </Button>
  );
}

export const MenuButton = React.forwardRef(MenuButtonImpl);
