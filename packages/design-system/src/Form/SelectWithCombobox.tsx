import * as React from "react";
import { Select, Combobox } from ".";
import { Badge } from "../Badge";
import { focusSelectorWithin } from "../stitches/stateSelectors";

type Options = { id: string; name: string }[];
type onSelect = (id: string) => void;
type onCreate = (value: string) => void;

type ComboboxListItemsProps = {
  comboboxState: Combobox.State;
  selectState: Select.State;
  onSelect: onSelect;
  onCreate: onCreate;
  options: Options;
};

function ComboboxListItems({
  comboboxState,
  onSelect,
  onCreate,
  selectState,
  options,
}: ComboboxListItemsProps) {
  const matches = comboboxState.matches.filter(
    (item) => item !== selectState.value
  );

  const hasValidCreationValue =
    comboboxState.value.length &&
    !options.map((option) => option.name).includes(comboboxState.value);

  const Items: (JSX.Element | null)[] = [
    hasValidCreationValue ? (
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
    ) : null,
    ...matches.map((item, index) => {
      const id = options.find((option) => option.name === item)?.id;

      if (!id) return null;

      return (
        <Combobox.Item key={item + index}>
          {(props) => (
            <Select.Item {...props} value={item} onClick={() => onSelect(id)}>
              {item}
              <Badge size="small">Auswählen</Badge>
            </Select.Item>
          )}
        </Combobox.Item>
      );
    }),
  ].filter((element) => element != null);

  if (Items.length > 0) {
    return Items.map((Item) => Item);
  }

  return <Combobox.Item disabled>Keine Auswahlmöglichkeiten</Combobox.Item>;
}

export type SelectWithComboboxProps = {
  onCreate: onCreate;
  onSelect: onSelect;
  selectOptions: Options;
  selectPlaceholder?: string;
  comboboxPlaceholder?: string;
  value?: string;
  setValue?: (newValue: string) => void;
  defaultValue?: string;
} & Pick<Select.InputProps, "css">;

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
    css,
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
          borderRadius: "$md",
          marginLeft: "-1px",
          justifyContent: "space-between",

          [`${focusSelectorWithin}`]: {
            borderLeftColor: "$primary9",
            zIndex: "$10",
          },

          ...css,
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
          {/* FIXME this has weird typing  */}
          {/* @ts-expect-error - weird typing */}
          <ComboboxListItems
            options={selectOptions}
            comboboxState={comboboxState}
            selectState={selectState}
            onSelect={onSelect}
            onCreate={onCreate}
          />
        </Combobox.List>
      </Select.Popover>
    </>
  );
});
