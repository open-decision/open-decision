import { Button, Icon, Text, Tooltip } from "@open-decision/design-system";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { sideMenuTooltipProps } from "./SideMenu/shared";
import { PlaceholderNodePlugin, useEditor } from "@open-decision/node-editor";
import { useTreeClient } from "@open-decision/tree-sync";

const PlaceholderNode = new PlaceholderNodePlugin();

type Props = { className?: string };

export function CreateNodeButton({ className }: Props) {
  const t = useTranslations("builder.createNodeButton");
  const treeClient = useTreeClient();

  const { getCenter, zoomToNode, replaceSelectedNodes } = useEditor();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button
          variant="primary"
          name={t("hiddenLabel")}
          square
          className={className}
          onClick={() => {
            const newNode = PlaceholderNode.create({
              position: getCenter(),
            })(treeClient);

            treeClient.nodes.add(newNode);

            replaceSelectedNodes([newNode.id]);
            zoomToNode(newNode);
          }}
        >
          <Icon label={t("hiddenLabel")}>
            <PlusIcon />
          </Icon>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content {...sideMenuTooltipProps}>
          <Text>{t("tooltip")}</Text>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
