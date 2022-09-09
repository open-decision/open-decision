import React from "react";
import {
  Combobox,
  StyleObject,
  Badge,
  Icon,
} from "@open-decision/design-system";
import { useEditor } from "../state/useEditor";
import { useTreeClient, useTreeContext } from "../state/treeStore/TreeContext";
import { useTranslations } from "next-intl";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { getNodeNames } from "@open-decision/type-classes";

type Props = { css?: StyleObject };

export const NodeSearch = ({ css }: Props) => {
  const t = useTranslations("builder.nodeSearch");

  const { tree } = useTreeContext();
  const treeClient = useTreeClient();
  const { replaceSelectedNodes } = useEditor();

  const nodeNames = getNodeNames(tree.syncedStore)();

  const { getCenter, zoomToNode } = useEditor();
  const combobox = Combobox.useComboboxState({
    gutter: 8,
    sameWidth: true,
    list: nodeNames.map((nodeName) => nodeName.name) ?? [],
  });

  function createHandler(label: string) {
    const newAnswer = treeClient.input.select.createAnswer({ text: "" });
    const newInput = treeClient.inputs.create({ answers: [newAnswer] });

    const newNode = treeClient.nodes.create.node({
      position: getCenter(),
      data: {
        name: label,
        inputs: [newInput.id],
        conditions: [],
      },
    });

    treeClient.nodes.add(newNode);
    treeClient.inputs.add(newInput);
    replaceSelectedNodes([newNode.id]);
    zoomToNode(newNode);

    return { id: newNode.id, label: newNode.data.name };
  }

  function changeHandler(newSelectedItemId: string) {
    replaceSelectedNodes([newSelectedItemId]);
    const node = treeClient.nodes.get.single(newSelectedItemId);

    if (!node) return;
    zoomToNode(node);
  }

  return (
    <>
      <Combobox.Input
        state={combobox}
        placeholder={t("placeholder")}
        css={{ width: "400px", ...css }}
        Icon={(props) => (
          <Icon {...props}>
            <MagnifyingGlassIcon />
          </Icon>
        )}
      />
      {combobox.value ? (
        <Combobox.Popover state={combobox}>
          {combobox.matches.length ? (
            combobox.matches.map((item) => {
              const id = nodeNames.find(
                (nodeName) => nodeName.name === item
              )?.id;
              return id ? (
                <Combobox.Item
                  value={item}
                  key={item}
                  onClick={() => changeHandler(id)}
                >
                  {item}
                  <Badge size="small">{t("selectBadge")}</Badge>
                </Combobox.Item>
              ) : null;
            })
          ) : (
            <Combobox.Item
              onClick={() => createHandler(combobox.value)}
              value={combobox.value}
            >
              {combobox.value}
              <Badge css={{ colorScheme: "success" }} size="small">
                {t("createBadge")}
              </Badge>
            </Combobox.Item>
          )}
        </Combobox.Popover>
      ) : null}
    </>
  );
};

export default NodeSearch;
