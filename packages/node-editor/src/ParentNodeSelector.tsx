import { Box, DropdownMenu } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import { useEditor } from "./state";

type Props = { parentNodes: { id: string; name?: string }[] };

export function ParentNodeSelector({ parentNodes }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar.parentNodeSelector");
  const { replaceSelectedNodes } = useEditor();

  return (
    <Box as="section">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <DropdownMenu.Button variant="secondary" size="small">
            {t("label")}
          </DropdownMenu.Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" css={{ groupColor: "$black" }}>
          {parentNodes.map((parentNode) => {
            return (
              <DropdownMenu.Item
                key={parentNode.id}
                onClick={() => replaceSelectedNodes([parentNode.id])}
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
