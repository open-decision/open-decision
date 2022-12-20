import { DropdownMenu, Button } from "@open-decision/design-system";

type Props<TOptions extends Record<string, string>> = {
  filter?: keyof TOptions;
  options: TOptions;
  setFilter: (newOption: keyof TOptions) => void;
  defaultFilter?: string;
} & DropdownMenu.TriggerProps;

export function FilterButton<TOptions extends Record<string, string>>({
  filter,
  options,
  setFilter,
  defaultFilter,
  ...props
}: Props<TOptions>) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="secondary"
          size="small"
          className={
            filter && filter !== defaultFilter
              ? "colorScheme-primary"
              : "colorScheme-gray"
          }
          {...props}
        >
          <span>
            Filter{filter && options[filter] ? `: ${options[filter]}` : ""}
          </span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        <DropdownMenu.CheckboxGroup
          options={options}
          selected={filter}
          toggleOption={(newOption) => setFilter(newOption)}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
