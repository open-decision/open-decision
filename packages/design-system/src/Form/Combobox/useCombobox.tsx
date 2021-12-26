import * as React from "react";
import {
  GetPropsCommonOptions,
  UseComboboxGetComboboxPropsOptions,
  UseComboboxGetInputPropsOptions,
  UseComboboxGetItemPropsOptions,
  UseComboboxGetLabelPropsOptions,
  UseComboboxGetMenuPropsOptions,
  UseComboboxGetToggleButtonPropsOptions,
} from "downshift";

export type Item = { readonly id: string; readonly label: string };

type Context = {
  inputValue: string;
  highlightedIndex: number;
  selectedItem: Item | null;
  isOpen: boolean;
  inputItems: Item[];
  reset: () => void;
  isCreating: boolean;
  setInputValue: (inputValue: string) => void;
  name: string;
  propGetters: {
    getMenuProps: (
      options?: UseComboboxGetMenuPropsOptions,
      otherOptions?: GetPropsCommonOptions
    ) => any;
    getInputProps: (
      options?: UseComboboxGetInputPropsOptions,
      otherOptions?: GetPropsCommonOptions
    ) => any;
    getComboboxProps: (
      options?: UseComboboxGetComboboxPropsOptions,
      otherOptions?: GetPropsCommonOptions
    ) => any;
    getLabelProps: (options?: UseComboboxGetLabelPropsOptions) => any;
    getToggleButtonProps: (
      options?: UseComboboxGetToggleButtonPropsOptions
    ) => any;
    getItemProps: (options: UseComboboxGetItemPropsOptions<Item>) => any;
  };
};

export const ComboboxContext = React.createContext<Context | null>(null);

export function useCombobox() {
  const context = React.useContext(ComboboxContext);

  if (!context) {
    throw new Error(
      `useCombobox can only be used when nested inside a Combobox.Root component.`
    );
  }

  return context;
}
