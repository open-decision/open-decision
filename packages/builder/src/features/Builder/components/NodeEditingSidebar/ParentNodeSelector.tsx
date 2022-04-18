import { Box, DropdownMenu, hoverStyle } from "@open-decision/design-system";
import { MenuButton } from "components/Header/MenuButton";
import { useEditor } from "features/Builder/state/useEditor";

type Props = { parentNodes: { id: string; name?: string }[] };

export function ParentNodeSelector({ parentNodes }: Props) {
  const { addSelectedNodes } = useEditor();

  return (
    <Box as="section">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <MenuButton label="Elternknoten" variant="secondary" size="small" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {parentNodes.map((parentNode) => {
            return (
              <DropdownMenu.Item
                key={parentNode.id}
                onClick={() => addSelectedNodes([parentNode.id])}
                css={{
                  ...hoverStyle({ textDecoration: "underline" }),
                }}
              >
                {parentNode.name ?? <i>Elternknoten ohne Namen</i>}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
}
