import {
  Stack,
  Button,
  Icon,
  DropdownMenu,
} from "@open-decision/design-system";
import { ArrowUpIcon } from "@radix-ui/react-icons";

export type SortButtonProps<TOptions extends Record<string, string>> = {
  sort: keyof TOptions;
  options: TOptions;
  direction: "ascending" | "descending";
  setSort: React.Dispatch<keyof TOptions>;
  setDirection: React.Dispatch<"ascending" | "descending">;
};

export function SortButton<TOptions extends Record<string, string>>({
  sort,
  options,
  direction,
  setSort,
  setDirection,
}: SortButtonProps<TOptions>) {
  return (
    <DropdownMenu.Root>
      <Stack css={{ flexDirection: "row", alignItems: "center", gap: "$2" }}>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="secondary"
            size="small"
            data-direction={direction}
            css={{
              colorScheme: sort ? "primary" : "gray",

              svg: {
                transition: "transform 0.2s ease-in",
                transform: "rotate(0deg)",
              },

              "&[data-direction='descending']": {
                svg: {
                  transform: "rotate(180deg)",
                },
              },
            }}
          >
            <span>Sortieren{`: ${options[sort]}`}</span>
            <Icon>
              <ArrowUpIcon />
            </Icon>
          </Button>
        </DropdownMenu.Trigger>
      </Stack>
      <DropdownMenu.Content align="start">
        <DropdownMenu.CheckboxGroup
          options={{ ascending: "Aufsteigend", descending: "Absteigend" }}
          selected={direction}
          toggleOption={(newOption) => setDirection(newOption)}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.CheckboxGroup
          options={options}
          selected={sort}
          toggleOption={(newOption) => setSort(newOption)}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
