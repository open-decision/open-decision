import { matchSorter } from "match-sorter";
import * as React from "react";
import { Box } from "../../Box";
import { Item, ComboboxContext } from "./useCombobox";
import { useCombobox as useComboboxPrimitive } from "downshift";
import { StyleObject } from "../../stitches";
import { useController, useFormContext } from "react-hook-form";
import { Row } from "../../Layout";

const fallbackSelectedItem = {
  id: "",
  label: "",
};

export type ComboboxRootProps = {
  css?: StyleObject;
  items: Item[];
  subsetOfItems?: string[];
  onReset?: () => void;
  onCreate?: (itemLabel: string) => Item | Error;
  onInputValueChange?: (inputValue: string) => void;
  onIsCreatingChange?: (isCreating: boolean) => void;
  onSelectedItemChange?: (item: Item | null | undefined) => void;
  children: React.ReactNode;
  name: string;
  defaultValue?: string;
  missingLabelPlaceholder?: string;
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
  missingLabelPlaceholder = "",
}: ComboboxRootProps) {
  const itemToString = (item: Item | null) => item?.label ?? "";

  const { trigger } = useFormContext();
  const {
    field: { onChange, value: selectedItemId },
    formState: { isValid, isValidating },
  } = useController({
    name,
    defaultValue,
  });

  const initialItem = items.find((item) => item.id === selectedItemId);

  const itemSubset = subsetOfItems
    ? items.filter((item) => subsetOfItems.includes(item.id))
    : items;
  const [inputItems, setInputItems] = React.useState(itemSubset);

  const hasLabel = (initialItem?.label?.length ?? "") > 0;

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

      if (isCreating && item?.id === "create" && onCreate && isValid) {
        const possibleItem = onCreate(selectedItem?.label ?? "");

        if (possibleItem instanceof Error) return;
        item = possibleItem;
      } else {
        onSelectedItemChange?.(item);
      }

      onChange(item?.id ?? fallbackSelectedItem.id);
    },
    onInputValueChange: async ({ inputValue }) => {
      const filteredItems = matchSorter(itemSubset, inputValue ?? "", {
        keys: ["label"],
      });

      const nonEmptyInputValue = (inputValue?.trim().length ?? 0) > 0;
      const nonEqualInputValueAndFilteredItem = !items.some((item) => {
        return item.label === inputValue?.trim();
      });

      const isValid = await trigger();

      const isCreating = validIsCreating(
        nonEmptyInputValue && nonEqualInputValueAndFilteredItem && isValid
      );

      if (isCreating)
        filteredItems.unshift({
          label: inputValue,
          id: "create",
          labelIcon: (
            <Row
              css={{
                fontWeight: "500",
                alignItems: "center",
                color: "$success11",
                gap: "$1",
                minWidth: "max-content",
              }}
            >
              Erstellen
            </Row>
          ),
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
          getInputProps: () =>
            getInputProps(
              selectedItemId && !hasLabel
                ? ({
                    placeholder: missingLabelPlaceholder,
                    css: {
                      "::placeholder": {
                        fontStyle: "italic",
                        fontWeight: "600",
                      },
                    },
                  } as any)
                : {}
            ),
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
