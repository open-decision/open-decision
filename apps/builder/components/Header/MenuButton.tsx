import * as React from "react";
import { ButtonProps, DropdownMenu } from "@open-decision/design-system";
type Props = { label: React.ReactNode } & ButtonProps;

function MenuButtonImpl(
  { label, css, ...props }: Props,
  ref: React.Ref<HTMLButtonElement>
) {
  const Label =
    typeof label === "string" && (label.length ?? "") > 60
      ? label.slice(0, 60).concat("...")
      : label;

  return (
    <DropdownMenu.Button
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
    </DropdownMenu.Button>
  );
}

export const MenuButton = React.forwardRef(MenuButtonImpl);
