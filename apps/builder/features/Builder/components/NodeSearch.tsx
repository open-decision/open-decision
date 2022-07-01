import React from "react";
import {
  Combobox,
  StyleObject,
  Row,
  Badge,
} from "@open-decision/design-system";
import { useEditor } from "../state/useEditor";
import { useTreeContext } from "../state/treeStore/TreeContext";

type Props = { css?: StyleObject };

export const NodeSearch = ({ css }: Props) => {
  const {
    treeClient: { nodes },
    replaceSelectedNodes,
  } = useTreeContext();

  const nodeNames = nodes.getN.onlyWithNames();

  const { getCenter, zoomToNode } = useEditor();
  const combobox = Combobox.useComboboxState({
    gutter: 8,
    sameWidth: true,
    list: nodeNames.map((nodeName) => nodeName.name),
  });

  function createHandler(label: string) {
    const newNode = nodes.create({
      position: getCenter(),
      data: {
        name: label,
        inputs: [],
        conditions: [],
      },
    });

    nodes.add(newNode);
    replaceSelectedNodes([newNode.id]);
    zoomToNode(newNode);

    return { id: newNode.id, label: newNode.data.name };
  }

  function changeHandler(newSelectedItemId: string) {
    replaceSelectedNodes([newSelectedItemId]);
    const node = nodes.get.byId(newSelectedItemId);

    if (!node) return;
    zoomToNode(node);
  }

  return (
    <>
      <Combobox.Input
        state={combobox}
        placeholder="Suche"
        css={{ width: "400px", ...css }}
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
                  <Badge size="small">Auswählen</Badge>
                </Combobox.Item>
              ) : null;
            })
          ) : (
            <Combobox.Item
              onClick={() => createHandler(combobox.value)}
              value={combobox.value}
            >
              {combobox.value}
              <Row
                css={{
                  colorScheme: "success",
                  fontWeight: "500",
                  alignItems: "center",
                  color: "$success11",
                  gap: "$1",
                  minWidth: "max-content",
                }}
              >
                Erstellen
              </Row>
            </Combobox.Item>
          )}
        </Combobox.Popover>
      ) : null}
    </>
  );
};
