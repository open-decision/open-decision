import * as React from "react";
import { ButtonProps, DropdownMenu } from "@open-decision/design-system";
type Props = { label: React.ReactNode } & ButtonProps;

function MenuButtonImpl(
  { label, className, classNames, size, ...props }: Props,
  ref: React.Ref<HTMLButtonElement>
) {
  const Label =
    typeof label === "string" && (label.length ?? "") > 60
      ? label.slice(0, 60).concat("...")
      : label;

  return (
    <DropdownMenu.Button
      variant="neutral"
      classNames={[
        "min-w-max [&[data-state=open] .rotate]:rotate-180",
        classNames,
        className,
      ]}
      ref={ref}
      size={size}
      {...props}
    >
      {Label}
    </DropdownMenu.Button>
  );
}

export const MenuButton = React.forwardRef(MenuButtonImpl);
