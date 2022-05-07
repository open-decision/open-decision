import * as React from "react";
import { Box } from "../../Box";
import { Text } from "../../Text";
import { StyleObject } from "../../stitches";
import { useCombobox } from "./useCombobox";
import { ValidationMessage } from "..";
import { useController, UseControllerProps } from "react-hook-form";
import { mergeRefs } from "../../internal/utils/composeRef";
import { menuContainerStyles, menuItemStyles } from "../../Menus/shared";

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
    isOpen,
    highlightedIndex,
    inputItems,
    propGetters: {
      getInputProps,
      getComboboxProps,
      getMenuProps,
      getItemProps,
    },
  } = useCombobox();

  const {
    field: { onChange, onBlur: controllerOnBlur, ref: controllerRef },
    fieldState: { error },
  } = useController({ name, rules });

  const { ref: inputRef, ...inputProps } = getInputProps({
    onChange,
    onBlur: controllerOnBlur,
  });

  const field = {
    ...inputProps,
    ref: mergeRefs([inputRef, controllerRef]),
  };

  const openState = isOpen ? "open" : "closed";

  return (
    <Box
      css={{ position: "relative", ...css }}
      data-state={openState}
      {...getComboboxProps()}
    >
      {children(field)}
      {error?.message ? (
        <ValidationMessage
          errors={[error?.message]}
          css={{ marginTop: "$1" }}
        />
      ) : null}
      <Box
        data-state={openState}
        {...getMenuProps()}
        className={menuContainerStyles({
          css: {
            width: "100%",
            padding: 0,
            paddingBlock: isOpen ? "$2" : undefined,
            listStyle: "none",
            position: "absolute",
            marginTop: "$1",
            display: inputItems.length > 0 ? "grid" : "none",
            maxHeight: "500px",
            ...menuCss,
          },
        })}
        as="ul"
      >
        {isOpen &&
          inputItems.map((item, index) => {
            return (
              <Text
                data-state={openState}
                as="li"
                data-focus={highlightedIndex === index}
                className={menuItemStyles({
                  css: { justifyContent: "space-between" },
                })}
                key={`${item?.id}${index}`}
                {...getItemProps({ item, index })}
              >
                {item?.label}
                {item?.labelIcon}
              </Text>
            );
          })}
      </Box>
    </Box>
  );
}
