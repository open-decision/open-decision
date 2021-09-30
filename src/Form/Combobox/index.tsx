import * as React from "react";
import { useCombobox, UseComboboxProps } from "downshift";
import { Input } from "../Input/Input";
import { Box } from "../../Box";
import { Mutable } from "utility-types";
import { Text } from "../../Text";

type Props<
  TItems extends readonly { readonly id: string; readonly label: string }[]
> = {
  name: string;
  items: TItems;
  selectedItemId: TItems[number]["id"];
} & Omit<UseComboboxProps<TItems[number]>, "selectedItem" | "items">;

export function Combobox<
  TItems extends readonly { readonly id: string; readonly label: string }[]
>({ name, items, selectedItemId, ...props }: Props<TItems>) {
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: items as Mutable<TItems>,
    selectedItem: items.find((item) => item.id === selectedItemId) ?? {
      id: "",
      label: "",
    },
    itemToString: (item) => item?.label ?? "",
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
          items.map((item, index) => (
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
