import { Button, Icon, DropdownMenu } from "@open-decision/design-system";
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
      <DropdownMenu.Trigger asChild>
        <Button
          variant="secondary"
          size="small"
          data-direction={direction}
          classNames={[sort ? "colorScheme-primary" : "colorScheme-gray"]}
        >
          <span>Sortieren{`: ${options[sort]}`}</span>
          <Icon
            size="extra-small"
            className={`${
              direction === "descending" ? "rotate-180" : "rotate-0"
            }`}
          >
            <ArrowUpIcon />
          </Icon>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
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
