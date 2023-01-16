import { Button, DropdownMenu } from "@open-decision/design-system";
import { useTranslations } from "next-intl";

export type InputDropdownProps<TInputTypes extends string[]> = {
  onSelect: (type: TInputTypes[number]) => void;
  inputPlugins: TInputTypes;
  currentType?: string;
} & Omit<DropdownMenu.DropdownButtonProps, "onSelect">;

export function InputDropdown<TInputTypes extends string[]>({
  onSelect,
  inputPlugins,
  className,
  classNames,
  currentType,
  ...props
}: InputDropdownProps<TInputTypes>) {
  const t = useTranslations("common.inputNames");

  const relevantInputTypes = Object.values(inputPlugins).filter(
    (type) => type !== "placeholder"
  );

  return Object.values(relevantInputTypes).length === 1 ? (
    <Button
      disabled
      variant="neutral"
      classNames={classNames}
      className={className}
      {...props}
    >
      {t(currentType as any)}
    </Button>
  ) : (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <DropdownMenu.Button
          variant="neutral"
          classNames={classNames}
          className={className}
          {...props}
        >
          {t(currentType as any)}
        </DropdownMenu.Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        {relevantInputTypes.map((type) => {
          return (
            <DropdownMenu.Item
              key={type}
              onSelect={() => {
                onSelect(type);
              }}
            >
              {t(type as any)}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
