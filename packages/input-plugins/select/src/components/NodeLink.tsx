import { ButtonProps, Button, Icon } from "@open-decision/design-system";
import { useNode } from "../../../../../apps/builder/features/Builder/state/treeStore/hooks";
import { useTreeContext } from "../../../../../apps/builder/features/Builder/state/treeStore/TreeContext";
import { Crosshair2Icon } from "@radix-ui/react-icons";

type NodeLinkProps = { target?: string } & Omit<ButtonProps, "label" | "Icon">;

export function NodeLink({ target, css, ...props }: NodeLinkProps) {
  const node = useNode(target ?? "");
  const { replaceSelectedNodes } = useTreeContext();

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
        if (target) {
          replaceSelectedNodes([target]);
        }
      }}
      type="button"
      disabled={!target}
      {...props}
    >
      <Icon
        label={
          node ? `Gehe zu Node: ${node.data.name}` : "Keine Node verbunden"
        }
      >
        <Crosshair2Icon />
      </Icon>
    </Button>
  );
}
