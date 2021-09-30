import * as React from "react";
import { useCombobox, UseComboboxProps } from "downshift";
import { Input } from "../Input/Input";
import { Box } from "../../Box";

type Props<TItem> = {
  name: string;
  items: TItem[];
  selectedItem: string;
} & UseComboboxProps<TItem>;

export function Combobox<TItem>({ name, items, ...props }: Props<TItem>) {
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({ items, ...props });

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
        }}
      >
        {isOpen &&
          items.map((item, index) => (
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
              {item}
            </Box>
          ))}
      </Box>
    </Box>
  );
}
