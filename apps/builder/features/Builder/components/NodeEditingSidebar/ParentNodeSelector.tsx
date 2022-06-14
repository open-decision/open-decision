import { Box, DropdownMenu, hoverSelector } from "@open-decision/design-system";
import { useTreeContext } from "../../state/treeStore/TreeContext";

type Props = { parentNodes: { id: string; name?: string }[] };

export function ParentNodeSelector({ parentNodes }: Props) {
  const { replaceSelectedNodes } = useTreeContext();

  return (
    <Box as="section">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <DropdownMenu.Button variant="secondary" size="small">
            Elternknoten
          </DropdownMenu.Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {parentNodes.map((parentNode) => {
            return (
              <DropdownMenu.Item
                key={parentNode.id}
                onClick={() => replaceSelectedNodes([parentNode.id])}
                css={{
                  [`${hoverSelector}`]: { textDecoration: "underline" },
                }}
              >
                {parentNode.name || <i>Elternknoten ohne Namen</i>}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
}
