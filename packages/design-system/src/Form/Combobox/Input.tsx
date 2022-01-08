import * as React from "react";
import { Box } from "../../Box";
import { Text } from "../../Text";
import { X } from "../../icons";
import { StyleObject } from "../../stitches";
import { useCombobox } from "./useCombobox";
import { Button } from "../..";
import { Icon } from "../../Icon/Icon";
import { ValidationMessage } from "..";
import {
  useController,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import { mergeRefs } from "../../internal/utils/composeRef";

export type ComboboxInputProps = {
  children: (field) => JSX.Element;
  css?: StyleObject;
  menuCss?: StyleObject;
  name: string;
} & UseControllerProps["rules"];

export function Input({
  children,
  css,
  menuCss,
  name,
  ...rules
}: ComboboxInputProps) {
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

  const { clearErrors } = useFormContext();

  const {
    field: { onChange, onBlur: controllerOnBlur, ref: controllerRef },
  } = useController({ name, rules });

  const { ref: inputRef, ...inputProps } = getInputProps({
    onChange,
    onBlur: controllerOnBlur,
  });

  const field = {
    ...inputProps,
    ref: mergeRefs([inputRef, controllerRef]),
    Buttons: (
      <Button
        size="small"
        variant="ghost"
        type="button"
        disabled={!inputValue}
        square
        css={{
          focusStyle: "inner",
          opacity: inputValue ? 1 : "0 !important",
        }}
        onClick={() => {
          clearErrors(name);
          return reset();
        }}
      >
        <Icon label="Entferne die momentan ausgewählte Option">
          <X />
        </Icon>
      </Button>
    ),
  };

  const openState = isOpen ? "open" : "closed";

  return (
    <Box
      css={{ position: "relative", ...css }}
      data-state={openState}
      {...getComboboxProps()}
    >
      {children(field)}
      <ValidationMessage name={name} css={{ marginTop: "$1" }} />
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
                  wordBreak: "break-word",
                  hyphens: "auto",
                  "&:not(:last-child)": {
                    borderBottom: "1px solid $colors$gray4",
                  },
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
