import {
  Button,
  Icon,
  StyleObject,
  Text,
  Tooltip,
} from "@open-decision/design-system";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useTreeClient } from "@open-decision/tree-sync";
import { useEditor } from "../state/useEditor";
import { sideMenuTooltipProps } from "./SideMenu/shared";

type Props = { css?: StyleObject };

export function CreateNodeButton({ css }: Props) {
  const t = useTranslations("builder.createNodeButton");
  const treeClient = useTreeClient();

  const { getCenter, zoomToNode } = useEditor();
  const { replaceSelectedNodes } = useEditor();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button
          variant="primary"
          name={t("hiddenLabel")}
          square
          css={css}
          onClick={() => {
            const newNode = treeClient.nodes.create.node({
              type: "customNode",
              data: { inputs: [], conditions: [] },
              position: getCenter(),
            });

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
