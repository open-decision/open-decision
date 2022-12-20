import React from "react";
import { Combobox, Badge, Icon } from "@open-decision/design-system";
import {
  useSubscribedTreeClient,
  useTreeClient,
} from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { PlaceholderNodePlugin, useEditor } from "@open-decision/node-editor";

type Props = { className?: string };

const PlaceholderNode = new PlaceholderNodePlugin();

export const NodeSearch = ({ className }: Props) => {
  const t = useTranslations("builder.nodeSearch");

  const treeClient = useTreeClient();
  const { replaceSelectedNodes } = useEditor();
  const subscribedTreeClient = useSubscribedTreeClient();
  const nodeNames = subscribedTreeClient.nodes.get.names();

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
    const newNode = PlaceholderNode.create({
      name: label,
      position: getCenter(),
    })(treeClient);

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
        classNames={["w-[400px]", className]}
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
              <Badge className="colorScheme-success" size="small">
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
