import { useSelector } from "@xstate/react";
import { useTree } from "features/Builder/state/useTree";
import * as React from "react";
import { matchSorter } from "match-sorter";
import { Box, Input } from "@open-legal-tech/design-system";
import { useEditor } from "features/Builder/state/useEditor";
import { useCombobox } from "downshift";

export function NodeSearch() {
  const service = useTree();
  const nodes = useSelector(service, (state) => state.context.nodes);
  const { selectedNodeId, setSelectedNodeId } = useEditor();
  const nodeArray = Object.values(nodes);
  const items = nodeArray.map((node) => node.id);
  const [inputItems, setInputItems] = React.useState(items);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    selectedItem: selectedNodeId ?? "",
    itemToString: (item) => (item ? nodes[item].data.label : ""),
    onSelectedItemChange: ({ selectedItem }) =>
      selectedItem ? setSelectedNodeId(selectedItem) : {},
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        matchSorter(nodeArray, inputValue ?? "", { keys: ["data.label"] }).map(
          (node) => node.id
        )
      );
    },
  });

  return (
    <Box css={{ position: "relative", flex: "1" }} {...getComboboxProps()}>
      <Input
        {...getInputProps()}
        css={{ borderRadius: "$md", width: "100%" }}
      />
      <Box
        {...getMenuProps()}
        as="ul"
        css={{
          position: "absolute",
          backgroundColor: "$gray2",
          width: "100%",
          marginTop: "$2",
          borderRadius: "$md",
          display: "grid",
          gap: "$1",
        }}
      >
        {isOpen &&
          inputItems.map((item, index) => (
            <Box
              as="li"
              css={{
                backgroundColor:
                  highlightedIndex === index ? "$primary3" : null,
                padding: "$1 $2",
              }}
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              {nodes[item].data.label}
            </Box>
          ))}
      </Box>
    </Box>
  );
}
