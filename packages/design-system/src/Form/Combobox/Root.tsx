import { matchSorter } from "match-sorter";
import * as React from "react";
import { Box } from "../../Box";
import { useInput } from "../useForm";
import { Item, ComboboxContext } from "./useCombobox";
import { useCombobox as useComboboxPrimitive } from "downshift";
import { StyleObject } from "../../stitches";
import { pipe } from "remeda";
import { useClickAway } from "react-use";

const fallbackSelectedItem = {
  id: "",
  label: "",
};

export type ComboboxRootProps = {
  css?: StyleObject;
  items: Item[];
  onReset?: () => void;
  onCreate?: (itemLabel: string) => Item;
  onInputValueChange?: (inputValue: string) => void;
  onIsCreatingChange?: (isCreating: boolean) => void;
  /**
   * Allows the Input to be reset when the focus moves away from it.
   * Note: The initialValue is not shown as the selectedItem when this is true,
   * because the Input is not reflecting the currently selectedItem.
   */
  resetOnBlur?: boolean;
  children: React.ReactNode;
  name: string;
};

export function Root({
  css,
  items,
  onReset,
  onCreate,
  onInputValueChange,
  onIsCreatingChange,
  resetOnBlur = false,
  children,
  name,
}: ComboboxRootProps) {
  const [inputItems, setInputItems] = React.useState(items);
  const { value, setValue } = useInput(name, "string");

  const cleanLabel = (label: string) => label.replace("Erstelle ", "");

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
    selectedItem,
    getItemProps,
    reset,
    inputValue,
    setInputValue,
  } = useComboboxPrimitive({
    items: inputItems,
    defaultSelectedItem: !resetOnBlur
      ? items.find((item) => item.id === value)
      : null,

    itemToString: (item) => cleanLabel(item?.label ?? ""),

    onInputValueChange: ({ inputValue }) => {
      const filteredItems = matchSorter(items, inputValue ?? "", {
        keys: ["label"],
      });

      const nonEmptyInputValue = (inputValue?.length ?? 0) > 0;
      const emptyFilteredItems = filteredItems.length === 0;
      const nonEqualInputValueAndFilteredItem = filteredItems.some(
        (filteredItem) => {
          return filteredItem.label !== inputValue;
        }
      );

      const isCreating = validIsCreating(
        nonEmptyInputValue &&
          (emptyFilteredItems || nonEqualInputValueAndFilteredItem)
      );

      if (isCreating)
        filteredItems.unshift({
          label: inputValue ? `Erstelle ${inputValue}` : "",
          id: "create",
        });

      updateIsCreating(isCreating);
      setInputItems(filteredItems);
      onInputValueChange?.(inputValue ?? "");
    },

    onSelectedItemChange: (changes) => {
      if (isCreating && (changes.inputValue?.length ?? 0) > 0 && onCreate) {
        const newItem = onCreate(cleanLabel(changes.selectedItem?.label ?? ""));
        return setValue(newItem.id);
      }

      return setValue(changes.selectedItem?.id ?? fallbackSelectedItem.id);
    },
  });

  const resetState = () => {
    onReset?.();
    reset();
    updateIsCreating(false);
  };

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
        resetState,
        propGetters: {
          getMenuProps,
          getInputProps,
          getComboboxProps,
          getLabelProps,
          getToggleButtonProps,
          getItemProps,
        },
      }}
    >
      <Box css={css} ref={ref}>
        {children}
      </Box>
    </ComboboxContext.Provider>
  );
}
