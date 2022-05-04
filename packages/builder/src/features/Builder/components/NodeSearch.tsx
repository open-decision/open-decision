import React from "react";
import {
  Combobox,
  StyleObject,
  Input,
  Box,
  Icon,
  useForm,
  Row,
} from "@open-decision/design-system";
import { useEditor } from "../state/useEditor";
import { nodeNameMaxLength } from "../utilities/constants";
import { useNodes } from "../state/treeStore/hooks";
import { useTreeContext } from "../state/treeStore/TreeContext";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

type Props = { css?: StyleObject };

export const NodeSearch = ({ css }: Props) => {
  const nodes = useNodes();
  const {
    createNode,
    addNode,
    getNode,
    createInput,
    createAnswer,
    addInput,
    replaceSelectedNodes,
  } = useTreeContext();

  const { getCenter, zoomToNode } = useEditor();
  const [Form] = useForm({
    defaultValues: {
      selectedNodeId: "",
      search: "",
    },
    mode: "onChange",
  });

  const items: Combobox.Item[] = React.useMemo(
    () =>
      Object.values(nodes)
        .filter((node) => node.data.name)
        .map((node) => ({
          id: node.id,
          label: node.data.name,
          labelIcon: (
            <Row
              css={{
                fontWeight: "500",
                alignItems: "center",
                color: "$primary11",
                gap: "$1",
                minWidth: "max-content",
              }}
            >
              Auswählen
            </Row>
          ),
        })),
    [nodes]
  );

  function createHandler(label: string) {
    const newAnswer = createAnswer({ text: "" });
    const newInput = createInput({ answers: [newAnswer] });

    const newNode = createNode({
      position: getCenter(),
      data: {
        name: label,
        inputs: [newInput.id],
        conditions: [],
      },
    });

    addNode(newNode);
    addInput(newInput);
    replaceSelectedNodes([newNode.id]);
    zoomToNode(newNode);

    return { id: newNode.id, label: newNode.data.name };
  }

  function changeHandler(newSelectedItemId: string) {
    replaceSelectedNodes([newSelectedItemId]);
    const node = getNode(newSelectedItemId);

    if (!node) return;
    zoomToNode(node);
  }

  return (
    <Form
      css={css}
      onSubmit={(data) => changeHandler(data.selectedNodeId ?? "")}
    >
      <Combobox.Root
        css={{ display: "flex", alignItems: "center", gap: "$2" }}
        name="selectedNodeId"
        items={items}
        onCreate={createHandler}
        key={items.length}
        onSelectedItemChange={(newItem) => changeHandler(newItem?.id ?? "")}
      >
        <Box css={{ width: "300px" }}>
          <Combobox.Input
            css={{ zIndex: "5" }}
            name="search"
            maxLength={nodeNameMaxLength}
          >
            {(field) => (
              <Input
                {...field}
                Icon={
                  <Icon>
                    <MagnifyingGlassIcon />
                  </Icon>
                }
                placeholder="Suche"
                variant="lowered"
              />
            )}
          </Combobox.Input>
        </Box>
      </Combobox.Root>
    </Form>
  );
};
