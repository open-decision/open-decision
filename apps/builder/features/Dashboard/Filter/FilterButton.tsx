import { Stack, DropdownMenu, Button } from "@open-decision/design-system";

type Props<TOptions extends Record<string, string>> = {
  filter?: keyof TOptions;
  options: TOptions;
  setFilter: (newOption: keyof TOptions) => void;
  defaultFilter?: string;
};

export function FilterButton<TOptions extends Record<string, string>>({
  filter,
  options,
  setFilter,
  defaultFilter,
}: Props<TOptions>) {
  return (
    <DropdownMenu.Root>
      <Stack css={{ flexDirection: "row", alignItems: "center", gap: "$2" }}>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="secondary"
            size="small"
            css={{
              colorScheme:
                filter && filter !== defaultFilter ? "primary" : "gray",
            }}
          >
            <span>
              Filter{filter && options[filter] ? `: ${options[filter]}` : ""}
            </span>
          </Button>
        </DropdownMenu.Trigger>
      </Stack>
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
