import * as React from "react";
import { useCombobox, UseComboboxProps } from "downshift";
import { Input } from "../Input/Input";
import { Box } from "../../Box";
import { Mutable } from "utility-types";
import { Text } from "../../Text";
import { matchSorter } from "match-sorter";

type Props<
  TItems extends readonly { readonly id: string; readonly label: string }[]
> = {
  name: string;
  items: TItems;
  selectedItemId?: TItems[number]["id"];
} & Omit<
  UseComboboxProps<TItems[number]>,
  "selectedItem" | "items" | "onInputValueChange"
>;

const fallbackSelectedItem = {
  id: "",
  label: "",
};

export function Combobox<
  TItems extends readonly { readonly id: string; readonly label: string }[]
>({ name, items, selectedItemId, ...props }: Props<TItems>) {
  const [inputItems, setInputItems] = React.useState(items);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems as Mutable<TItems>,
    selectedItem: selectedItemId
      ? items.find((item) => item.id === selectedItemId)
      : fallbackSelectedItem,
    itemToString: (item) => item?.label ?? "",
    onInputValueChange: ({ inputValue }) => {
      const filteredItems = matchSorter(items, inputValue ?? "", {
        keys: ["label"],
      });

      setInputItems(filteredItems as Mutable<TItems>);
    },
    ...props,
  });

  return (
    <Box css={{ position: "relative" }} {...getComboboxProps()}>
      <Input {...getInputProps()} name={name} css={{ borderRadius: "$md" }} />
      <Box
        {...getMenuProps()}
        as="ul"
        css={{
          width: "100%",
          padding: 0,
          listStyle: "none",
          position: "absolute",
          backgroundColor: "$gray2",
          marginTop: "$1",
          borderRadius: "$md",
          display: "grid",
          gap: "$1",
          overflow: "hidden",
        }}
      >
        {isOpen &&
          inputItems.map((item, index) => (
            <Text
              as="li"
              css={{
                backgroundColor:
                  highlightedIndex === index ? "$primary3" : null,
                padding: "$1 $2",
              }}
              key={`${item.id}${index}`}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </Text>
          ))}
      </Box>
    </Box>
  );
}
