import * as React from "react";
import { Box } from "../../Box";
import { Text } from "../../Text";
import { IconButton } from "../../Button/IconButton";
import { X } from "../../icons";
import { StyleObject } from "../../stitches";
import { InputProps } from "../Inputs";
import { useCombobox } from "./useCombobox";

export type ComboboxInputProps = {
  children: React.ReactElement<InputProps>;
  css?: StyleObject;
  menuCss?: StyleObject;
};

export function Input({ children, css, menuCss }: ComboboxInputProps) {
  const {
    inputValue,
    isOpen,
    highlightedIndex,
    inputItems,
    reset,
    propGetters: {
      getInputProps,
      getComboboxProps,
      getMenuProps,
      getItemProps,
    },
  } = useCombobox();

  React.Children.only(children);

  const EnhancedInput =
    React.isValidElement(children) &&
    React.cloneElement(children, {
      ...getInputProps(),
      Buttons: (
        <IconButton
          label="Entferne die momentan ausgewählte Option"
          Icon={<X />}
          size="small"
          variant="ghost"
          type="button"
          disabled={!inputValue}
          css={{
            focusStyle: "inner",
            opacity: inputValue ? 1 : "0 !important",
          }}
          onClick={() => reset()}
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
          gap: "$1",
          overflowY: "auto",
          zIndex: 1,
          boxShadow: "$2",
          display: inputItems.length > 0 ? "grid" : "none",
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
                    highlightedIndex === index ? "$primary9" : null,
                  color: highlightedIndex === index ? "$primary1" : null,
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
