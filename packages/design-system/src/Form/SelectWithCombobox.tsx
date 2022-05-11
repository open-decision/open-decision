import * as React from "react";
import { Select, Combobox } from ".";
import { Badge } from "../Badge";
import { focusSelectorWithin } from "../stitches/stateSelectors";

export type SelectWithComboboxProps = {
  onSelect: (id: string) => void;
  onCreate: (value: string) => void;
  selectOptions: { id: string; name: string }[];
  selectPlaceholder?: string;
  comboboxPlaceholder?: string;
  value?: string;
  setValue?: (newValue: string) => void;
  defaultValue?: string;
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
    setValue,
    defaultValue,
    selectPlaceholder,
    comboboxPlaceholder,
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
    value,
    setValue,
    defaultValue,
  });

  // Resets combobox value when popover is collapsed
  if (!selectState.mounted && comboboxState.value) {
    comboboxState.setValue("");
  }

  return (
    <>
      <Select.Input
        state={selectState}
        css={{
          borderRadius: 0,
          borderBottomRightRadius: "$md",
          marginLeft: "-1px",
          justifyContent: "space-between",

          [`${focusSelectorWithin}`]: {
            borderLeftColor: "$primary9",
            zIndex: "$10",
          },
        }}
        ref={ref}
      >
        {selectState.value.length ? selectState.value : selectPlaceholder}
        <Select.Arrow />
      </Select.Input>
      <Select.Popover state={selectState} composite={false}>
        <Combobox.Input
          state={comboboxState}
          placeholder={comboboxPlaceholder}
          css={{ marginInline: "$2", marginBottom: "$2" }}
        />
        <Combobox.List state={comboboxState}>
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
                      <Badge size="small">Auswählen</Badge>
                    </Select.Item>
                  )}
                </Combobox.Item>
              );
            })
          ) : comboboxState.value.length ? (
            <Combobox.Item key="create">
              {(props) => (
                <Select.Item
                  {...props}
                  value={comboboxState.value}
                  onClick={() => onCreate(comboboxState.value)}
                >
                  {comboboxState.value}
                  <Badge size="small" css={{ colorScheme: "success" }}>
                    Erstellen
                  </Badge>
                </Select.Item>
              )}
            </Combobox.Item>
          ) : (
            <Combobox.Item disabled>Keine Auswahlmöglichkeiten</Combobox.Item>
          )}
        </Combobox.List>
      </Select.Popover>
    </>
  );
});
