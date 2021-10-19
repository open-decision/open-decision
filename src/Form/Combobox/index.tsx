import * as React from "react";
import { useCombobox } from "downshift";
import { Box } from "../../Box";
import { Text } from "../../Text";
import { matchSorter } from "match-sorter";
import { IconButton } from "../../IconButton";
import { X } from "../../icons";
import { StyleObject } from "../../stitches";
import { InputProps } from "../Inputs";
import { useInput } from "../useForm";

export type Item = { readonly id: string; readonly label: string };

export type ComboboxProps<TItem extends Item> = {
  Input: React.ReactElement<InputProps>;
  items: TItem[];
  css?: StyleObject;
  menuCss?: StyleObject;
  onReset?: () => void;
  onCreate?: (itemLabel: string) => Item;
};

const fallbackSelectedItem = {
  id: "",
  label: "",
};

export function Combobox<TItem extends Item>({
  items,
  css,
  menuCss,
  Input,
  onReset,
  onCreate,
}: ComboboxProps<TItem>) {
  const [inputItems, setInputItems] = React.useState(items);
  const { value, setValue } = useInput(Input.props.name, "string");
  const [isCreating, setIsCreating] = React.useState(false);
  const validIsCreating = (isCreating: boolean) => {
    return onCreate != null ? isCreating : false;
  };

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    reset,
  } = useCombobox({
    items: inputItems,
    selectedItem: value
      ? items.find((item) => item?.id === value) ?? fallbackSelectedItem
      : fallbackSelectedItem,
    itemToString: (item) => (item?.label ?? "").replace("Erstelle ", ""),
    onInputValueChange: ({ inputValue }) => {
      const filteredItems = matchSorter(items, inputValue ?? "", {
        keys: ["label"],
      });

      const isCreating = validIsCreating(filteredItems.length === 0);
      setIsCreating(validIsCreating(isCreating));

      setInputItems(
        !isCreating
          ? filteredItems
          : [
              {
                label: inputValue ? `Erstelle ${inputValue}` : "",
                id: inputValue,
              } as TItem,
            ]
      );
    },
    onSelectedItemChange: (changes) => {
      if (isCreating) {
        const newItem = onCreate?.(changes.selectedItem?.id ?? "");
        return setValue(newItem?.id ?? "");
      }

      return setValue(changes.selectedItem?.id ?? "");
    },
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
          inputItems.map((item, index) => {
            return (
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
            );
          })}
      </Box>
    </Box>
  );
}
