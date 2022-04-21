import * as React from "react";
import { Button, ButtonProps, Icon } from "@open-decision/design-system";
import { TriangleDownIcon } from "@radix-ui/react-icons";
type Props = { label: React.ReactNode } & ButtonProps;

function MenuButtonImpl({ label, css, ...props }: Props, ref) {
  const Label =
    typeof label === "string" && (label.length ?? "") > 60
      ? label.slice(0, 60).concat("...")
      : label;

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
      {Label}
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
