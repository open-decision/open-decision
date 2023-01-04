import { CrossCircledIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { badgeClasses } from "../../Badge/Badge";
import { Button } from "../../Button";
import { Icon } from "../../Icon";
import { Row } from "../../Layout";
import { Separator } from "../../Separator";
import { twMerge } from "../../utils";
import { Combobox } from "../Combobox";
import { Select } from "../Select";

const inputClasses =
  "rounded-md ml-[-1px] justify-between focus-within:border-primary9 focus-within:z-10";

export type SelectWithComboboxProps = {
  onSelect: (id?: string) => void;
  onCreate?: (value: string) => void;
  selectOptions: { id: string; name: string }[];
  selectPlaceholder?: string;
  comboboxPlaceholder?: string;
  value?: string;
  onChange?: (newValue: string) => void;
  defaultValue?: string;
  className?: string;
  id?: string;
  withClearButton?: boolean;
};

export const SelectWithCombobox = React.forwardRef<
  HTMLButtonElement,
  SelectWithComboboxProps
>(function SelectWithCombobox(
  {
    onSelect,
    onCreate,
    selectOptions,
    value,
    onChange,
    defaultValue,
    selectPlaceholder,
    comboboxPlaceholder,
    className,
    id,
    withClearButton = true,
  },
  ref
) {
  const comboboxState = Combobox.useComboboxState({
    list: selectOptions.map((node) => node.name),
    gutter: 4,
    sameWidth: true,
  });
  // value and setValue shouldn't be passed to the select state because the
  // select value and the combobox value are different things.
  const {
    value: _comboboxValue,
    setValue: _setComboboxValue,
    ...selectProps
  } = comboboxState;
  const selectState = Select.useSelectState({
    ...selectProps,
    value: value ?? "",
    setValue: onChange,
    defaultValue,
  });

  // Resets combobox value when popover is collapsed
  if (!selectState.mounted && comboboxState.value) {
    comboboxState.setValue("");
  }

  return (
    <>
      <Row className="gap-2 flex-1">
        <Select.Input
          state={selectState}
          className={
            className ? twMerge(inputClasses, className) : inputClasses
          }
          ref={ref}
          id={id}
        >
          {selectState.value.length ? (
            selectState.value
          ) : (
            <span className="text-gray10">{selectPlaceholder}</span>
          )}
          <Select.Arrow />
        </Select.Input>
        {value && withClearButton ? (
          <Button
            variant="neutral"
            size="small"
            onClick={() => {
              selectState.setValue("");
              onSelect();
            }}
          >
            <Icon>
              <CrossCircledIcon />
            </Icon>
          </Button>
        ) : null}
      </Row>
      <Select.Popover state={selectState} composite={false}>
        <Combobox.Input
          state={comboboxState}
          placeholder={comboboxPlaceholder}
          className="m-2"
        />
        <Combobox.List state={comboboxState}>
          {comboboxState.value.length &&
          !selectOptions.find(
            (option) => option.name === comboboxState.value.trimEnd()
          ) ? (
            <>
              <Combobox.Item key="create">
                {(props) => (
                  <Select.Item
                    {...props}
                    value={comboboxState.value}
                    onClick={() => onCreate?.(comboboxState.value)}
                  >
                    {comboboxState.value}
                    <span
                      className={badgeClasses({ size: "small" }, [
                        "colorScheme-success",
                      ])}
                    >
                      Erstellen
                    </span>
                  </Select.Item>
                )}
              </Combobox.Item>
              <Separator />
            </>
          ) : null}
          {comboboxState.matches.length ? (
            comboboxState.matches.map((item, index) => {
              const id = selectOptions.find(
                (nodeName) => nodeName.name === item
              )?.id;

              if (!id) return null;

              const isActive = selectState.value === item;

              return isActive ? null : (
                <Combobox.Item key={item + index} focusOnHover>
                  {(props) => (
                    <Select.Item
                      {...props}
                      value={item}
                      onClick={() => onSelect(id)}
                    >
                      {item}
                      <span className={badgeClasses({ size: "small" })}>
                        Auswählen
                      </span>
                    </Select.Item>
                  )}
                </Combobox.Item>
              );
            })
          ) : (
            <Combobox.Item disabled>Keine Auswahlmöglichkeiten</Combobox.Item>
          )}
        </Combobox.List>
      </Select.Popover>
    </>
  );
});
