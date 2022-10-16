import React from "react";
import {
  Combobox,
  StyleObject,
  Badge,
  Icon,
} from "@open-decision/design-system";
import { useTree } from "@open-decision/tree-sync";
import { getNodeNames } from "@open-decision/tree-type";
import { useTranslations } from "next-intl";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEditor } from "@open-decision/node-editor";
import { useTreeClient } from "./TreeClient";

type Props = { css?: StyleObject };

export const NodeSearch = ({ css }: Props) => {
  const t = useTranslations("builder.nodeSearch");

  const { treeClient } = useTreeClient();
  const { replaceSelectedNodes } = useEditor();
  const nodeNames = useTree(getNodeNames);

  const { getCenter, zoomToNode } = useEditor();
  const combobox = Combobox.useComboboxState({
    gutter: 8,
    sameWidth: true,
    list:
      Object.values(nodeNames).map(
        (nodeName) => nodeName.name ?? "Kein Name"
      ) ?? [],
  });

  function createHandler(label: string) {
    // Currently we are always creating question nodes, because we do not have any
    // other node types yet.
    const newNode = treeClient.node.question.create(
      {
        name: label,
        position: getCenter(),
      },
      { inputs: [], content: [] }
    );

    treeClient.nodes.add(newNode);
    replaceSelectedNodes([newNode.id]);
    zoomToNode(newNode);

    return { id: newNode.id, label: newNode.name };
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
              const id = Object.values(nodeNames).find(
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
