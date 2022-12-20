import { ButtonProps, Button } from "../Button";
import { Icon } from "../Icon/Icon";
import { Crosshair2Icon } from "@radix-ui/react-icons";

export type NodeLinkProps = {
  target?: string;
  onClick: (target: string) => void;
  nodeName?: string;
} & Omit<ButtonProps, "label" | "Icon" | "onClick">;

export function NodeLink({
  target,
  onClick,
  nodeName,
  className,
  ...props
}: NodeLinkProps) {
  return (
    <Button
      className={`shadow-none rounded-md border border-gray6 width-[40px] ${
        target ? "colorScheme-primary" : "colorScheme-gray"
      } ${className}`}
      size="small"
      variant="secondary"
      square
      onClick={() => {
        target ? onClick(target) : null;
      }}
      type="button"
      disabled={!target}
      {...props}
    >
      <Icon
        label={nodeName ? `Gehe zu Node: ${nodeName}` : "Kein Knoten verbunden"}
      >
        <Crosshair2Icon />
      </Icon>
    </Button>
  );
}
