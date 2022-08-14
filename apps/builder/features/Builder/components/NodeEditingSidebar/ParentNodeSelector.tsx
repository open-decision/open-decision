import { Box, DropdownMenu, hoverSelector } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import { useTreeContext } from "../../state/treeStore/TreeContext";

type Props = { parentNodes: { id: string; name?: string }[] };

export function ParentNodeSelector({ parentNodes }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar.parentNodeSelector");
  const { replaceSelectedNodes } = useTreeContext();

  return (
    <Box as="section">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <DropdownMenu.Button variant="secondary" size="small">
            {t("label")}
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
                {parentNode.name || <i>{t("noNameFallback")}</i>}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
}
