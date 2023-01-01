import { Button, ButtonProps } from "@open-decision/design-system";

export function SidebarButton(props: ButtonProps) {
  return (
    <Button className="w-full" variant="secondary" size="small" {...props}>
      {props.children}
    </Button>
  );
}
