import { matchSorter } from "match-sorter";
import * as React from "react";
import { Box } from "../../Box";
import { Item, ComboboxContext } from "./useCombobox";
import { useCombobox as useComboboxPrimitive } from "downshift";
import { StyleObject } from "../../stitches";
import { pipe } from "remeda";
import { useClickAway } from "react-use";
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
  /**
   * Allows the Input to be reset when the focus moves away from it.
   * Note: The initialValue is not shown as the selectedItem when this is true,
   * because the Input is not reflecting the currently selectedItem.
   */
  resetOnBlur?: boolean;
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
  resetOnBlur = false,
  children,
  name,
  defaultValue = "",
}: ComboboxRootProps) {
  const {
    field: { onChange, value: selectedItem },
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
    setHighlightedIndex,
  } = useComboboxPrimitive({
    items: inputItems,
    initialSelectedItem: selectedItem,
    itemToString,
    onSelectedItemChange: ({ selectedItem }) => {
      let item = selectedItem;

      if (isCreating && (inputValue?.length ?? 0) > 0 && onCreate) {
        item = onCreate(cleanLabel(selectedItem?.label ?? ""));
      }

      onSelectedItemChange?.(item);
      onChange(item ?? fallbackSelectedItem.id);
    },
    onInputValueChange: ({ inputValue }) => {
      const filteredItems = matchSorter(itemSubset, inputValue ?? "", {
        keys: ["label"],
      });

      const nonEmptyInputValue = (inputValue?.length ?? 0) > 0;
      const emptyFilteredItems = filteredItems.length === 0;
      const nonEqualInputValueAndFilteredItem = !items.some((item) => {
        return item.label === inputValue?.trim();
      });

      const isCreating = validIsCreating(
        nonEmptyInputValue &&
          emptyFilteredItems &&
          nonEqualInputValueAndFilteredItem
      );

      if (isCreating)
        filteredItems.unshift({
          label: inputValue ? `Erstelle ${inputValue}` : "",
          id: "create",
        });

      updateIsCreating(isCreating);
      setInputItems(filteredItems);
      setHighlightedIndex(0);
    },
  });

  const ref = React.useRef<HTMLDivElement | null>(null);
  useClickAway(
    ref,
    (event) => {
      const isOption =
        event.target instanceof HTMLElement &&
        pipe(
          event.target.attributes,
          (NodeMap) => NodeMap.getNamedItem("role"),
          (role) => role?.nodeValue === "option"
        );

      return !isOption && resetOnBlur && setInputValue("");
    },
    ["click", "mousedown", "touchstart"]
  );

  return (
    <ComboboxContext.Provider
      value={{
        inputItems,
        inputValue,
        highlightedIndex,
        selectedItem,
        isOpen,
        reset,
        setInputValue,
        isCreating,
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
      <Box css={css} ref={ref}>
        {children}
      </Box>
    </ComboboxContext.Provider>
  );
}
