import { ButtonProps, Button, Icon } from "@open-decision/design-system";
import { Node } from "@open-decision/tree-type";
import { Crosshair2Icon } from "@radix-ui/react-icons";

export type NodeLinkProps = {
  target?: string;
  onClick: (target: string) => void;
  nodeName?: Node.TNode["name"];
} & Omit<ButtonProps, "label" | "Icon" | "onClick">;

export function NodeLink({
  target,
  onClick,
  nodeName,
  css,
  ...props
}: NodeLinkProps) {
  return (
    <Button
      css={{
        boxShadow: "none",
        borderRadius: "$md",
        focusType: "inner",
        colorScheme: target ? "primary" : "gray",
        border: "1px solid $colors$gray7",
        width: "40px",

        ...css,
      }}
      pressable={false}
      size="small"
      variant="secondary"
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
