import { matchSorter } from "match-sorter";
import * as React from "react";
import { Box } from "../../Box";
import { Item, ComboboxContext } from "./useCombobox";
import { useCombobox as useComboboxPrimitive } from "downshift";
import { StyleObject } from "../../stitches";
import { useController } from "react-hook-form";

const fallbackSelectedItem = {
  id: "",
  label: "",
};

const cleanLabel = (label: string) => label.replace("Erstelle ", "");
const itemToString = (item: Item | null) => cleanLabel(item?.label ?? "");
export type ComboboxRootProps = {
  css?: StyleObject;
  items: Item[];
  subsetOfItems?: Item[];
  onReset?: () => void;
  onCreate?: (itemLabel: string) => Item;
  onInputValueChange?: (inputValue: string) => void;
  onIsCreatingChange?: (isCreating: boolean) => void;
  onSelectedItemChange?: (item: Item | null | undefined) => void;
  children: React.ReactNode;
  name: string;
  defaultValue?: string;
};

export function Root({
  css,
  items,
  subsetOfItems,
  onCreate,
  onIsCreatingChange,
  onSelectedItemChange,
  children,
  name,
  defaultValue,
}: ComboboxRootProps) {
  const {
    field: { onChange, value: selectedItemId },
    formState: { isValid, isValidating },
  } = useController({
    name,
    defaultValue,
  });

  const itemSubset = subsetOfItems ?? items;
  const [inputItems, setInputItems] = React.useState(itemSubset);

  // ------------------------------------------------------------------
  // The following state is used to determine when the user is able to create a new item.
  // This should only ever be possible if an onCreate handler has been declared.
  const [isCreating, setIsCreating] = React.useState(false);

  const updateIsCreating = (isCreating: boolean) => {
    onIsCreatingChange?.(validIsCreating(isCreating));
    return setIsCreating(validIsCreating(isCreating));
  };

  const validIsCreating = (isCreating: boolean) => {
    return onCreate != null ? isCreating : false;
  };

  // ------------------------------------------------------------------

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getLabelProps,
    getToggleButtonProps,
    highlightedIndex,
    getItemProps,
    reset,
    inputValue,
    setInputValue,
  } = useComboboxPrimitive({
    items: inputItems,
    initialSelectedItem: items.find((item) => item.id === selectedItemId),
    itemToString,
    onSelectedItemChange: ({ selectedItem }) => {
      let item = selectedItem;

      if (isCreating && (inputValue?.length ?? 0) > 0 && onCreate && isValid) {
        item = onCreate(cleanLabel(selectedItem?.label ?? ""));
      }

      onSelectedItemChange?.(item);
      onChange(item?.id ?? fallbackSelectedItem.id);
    },
    onInputValueChange: ({ inputValue }) => {
      const filteredItems = matchSorter(itemSubset, inputValue ?? "", {
        keys: ["label"],
      });

      const nonEmptyInputValue = (inputValue?.length ?? 0) > 0;
      const nonEqualInputValueAndFilteredItem = !items.some((item) => {
        return item.label === inputValue?.trim();
      });

      const isCreating = validIsCreating(
        nonEmptyInputValue &&
          nonEqualInputValueAndFilteredItem &&
          isValid &&
          !isValidating
      );

      if (isCreating)
        filteredItems.unshift({
          label: inputValue ? `Erstelle ${inputValue}` : "",
          id: "create",
        });

      updateIsCreating(isCreating);
      setInputItems(filteredItems);
    },
  });

  return (
    <ComboboxContext.Provider
      value={{
        inputItems,
        inputValue,
        highlightedIndex,
        selectedItemId,
        isOpen,
        reset,
        setInputValue,
        isCreating: isValid && !isValidating && isCreating,
        name,
        propGetters: {
          getMenuProps,
          getInputProps,
          getComboboxProps,
          getLabelProps,
          getToggleButtonProps,
          getItemProps,
        },
      }}
      key={items.length}
    >
      <Box css={css}>{children}</Box>
    </ComboboxContext.Provider>
  );
}
