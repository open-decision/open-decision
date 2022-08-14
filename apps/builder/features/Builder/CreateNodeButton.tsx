import {
  Button,
  Icon,
  StyleObject,
  Text,
  Tooltip,
} from "@open-decision/design-system";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useTreeContext } from "./state/treeStore/TreeContext";
import { useEditor } from "./state/useEditor";

type Props = { css?: StyleObject };

export function CreateNodeButton({ css }: Props) {
  const t = useTranslations("builder.createNodeButton");
  const {
    createInput,
    createAnswer,
    createNode,
    addNode,
    addInput,
    addInputAnswer,
  } = useTreeContext();

  const { getCenter, zoomToNode } = useEditor();
  const { replaceSelectedNodes } = useTreeContext();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button
          name={t("hiddenLabel")}
          square
          css={{ boxShadow: "$2", ...css }}
          onClick={() => {
            const newInput = createInput();
            const newAnswer = createAnswer({ text: "" });

            const newNode = createNode({
              data: { inputs: [newInput.id], conditions: [] },
              position: getCenter(),
            });

            addNode(newNode);
            addInput(newInput);
            addInputAnswer(newInput.id, newAnswer);

            replaceSelectedNodes([newNode.id]);
            zoomToNode(newNode);
          }}
        >
          <Icon label={t("hiddenLabel")}>
            <PlusIcon />
          </Icon>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={15}>
        <Text>{t("tooltip")}</Text>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
