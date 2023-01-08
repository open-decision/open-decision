import { Button, DropdownMenu } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import { InputPluginObject } from "../types/InputPluginObject";

export type InputDropdownProps<
  TInputPlugins extends Record<string, InputPluginObject>
> = {
  onSelect: (type: keyof TInputPlugins) => void;
  inputPlugins: TInputPlugins;
  currentType?: string;
} & Omit<DropdownMenu.DropdownButtonProps, "onSelect">;

export function InputDropdown<
  TInputPlugins extends Record<string, InputPluginObject>
>({
  onSelect,
  inputPlugins,
  className,
  classNames,
  currentType,
  ...props
}: InputDropdownProps<TInputPlugins>) {
  const t = useTranslations("common.inputNames");

  const relevantInputPlugins = Object.values(inputPlugins).filter(
    (plugin) => plugin.plugin.type !== "placeholder"
  );

  return Object.values(relevantInputPlugins).length === 1 ? (
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
        {relevantInputPlugins.map((plugin) => {
          return (
            <DropdownMenu.Item
              key={plugin.type}
              onSelect={() => {
                onSelect(plugin.type);
              }}
            >
              {t(plugin.type as any)}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
