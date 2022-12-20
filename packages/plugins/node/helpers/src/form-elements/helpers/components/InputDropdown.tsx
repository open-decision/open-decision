import * as React from "react";
import { DropdownMenu, Icon } from "@open-decision/design-system";
import { PlusIcon } from "@radix-ui/react-icons";
import { InputPluginObject } from "../types/InputPluginObject";

export type InputDropdownProps<
  TInputPlugins extends Record<string, InputPluginObject>
> = {
  nodeId: string;
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
}: InputDropdownProps<TInputPlugins>) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <DropdownMenu.Button
          variant="neutral"
          size="small"
          classNames={classNames}
          className={className}
        >
          {currentType ? (
            currentType
          ) : (
            <>
              <Icon>
                <PlusIcon />
              </Icon>
              Neuen Input hinzufügen
            </>
          )}
        </DropdownMenu.Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        {Object.values(inputPlugins).map((plugin) => {
          return (
            <DropdownMenu.Item
              key={plugin.type}
              onSelect={() => {
                onSelect(plugin.type);
              }}
            >
              {plugin.type.charAt(0).toUpperCase() + plugin.type.slice(1)}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
