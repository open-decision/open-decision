import * as React from "react";
import { useCombobox, UseComboboxProps } from "downshift";
import { Box } from "../../Box";
import { Mutable } from "utility-types";
import { Text } from "../../Text";
import { matchSorter } from "match-sorter";
import { IconButton } from "../../IconButton";
import { X } from "../../icons";
import { StyleObject } from "../../stitches";
import { InputProps } from "../Inputs";

type Props<
  TItems extends readonly { readonly id: string; readonly label: string }[]
> = {
  Input: React.ReactElement<InputProps>;
  items: TItems;
  selectedItemId?: TItems[number]["id"];
  css?: StyleObject;
  menuCss?: StyleObject;
  onReset?: () => void;
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
>({
  items,
  selectedItemId,
  css,
  menuCss,
  Input,
  onReset,
  ...props
}: Props<TItems>) {
  const [inputItems, setInputItems] = React.useState(items);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    reset,
  } = useCombobox({
    items: inputItems as Mutable<TItems>,
    selectedItem: selectedItemId
      ? items.find((item) => item?.id === selectedItemId)
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

  const EnhancedInput = React.cloneElement(Input, {
    ...getInputProps(),
    Buttons: (
      <IconButton
        label="Entferne die momentan ausgewählte Option"
        Icon={<X />}
        size="small"
        variant="ghost"
        type="button"
        css={{ focusStyle: "inner" }}
        onClick={() => {
          onReset?.();
          reset();
        }}
      />
    ),
    ...Input.props,
  });

  const openState = isOpen ? "open" : "closed";

  return (
    <Box
      css={{ position: "relative", ...css }}
      data-state={openState}
      {...getComboboxProps()}
    >
      {EnhancedInput}
      <Box
        data-state={openState}
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
          overflowY: "auto",
          zIndex: 1,
          ...menuCss,
        }}
      >
        {isOpen &&
          inputItems.map((item, index) => (
            <Text
              data-state={openState}
              as="li"
              css={{
                backgroundColor:
                  highlightedIndex === index ? "$primary3" : null,
                padding: "$1 $2",
              }}
              key={`${item?.id}${index}`}
              {...getItemProps({ item, index })}
            >
              {item?.label}
            </Text>
          ))}
      </Box>
    </Box>
  );
}
