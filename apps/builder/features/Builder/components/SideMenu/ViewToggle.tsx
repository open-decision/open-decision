import * as React from "react";
import { Tabs, ToggleGroup, Icon, Tooltip } from "@open-decision/design-system";
import { Pencil2Icon, PlayIcon } from "@radix-ui/react-icons";
import { sideMenuTooltipProps } from "./shared";

type Props = { className?: string; selectedView: string };

export function ViewToggle({ selectedView, className }: Props) {
  return (
    <Tabs.List asChild>
      <>
        <ToggleGroup.Root
          type="single"
          defaultValue={selectedView}
          value={selectedView}
          layout="vertical"
          className={className}
        >
          <Tooltip.Root>
            <Tabs.Trigger value="editor" asChild>
              <Tooltip.Trigger asChild>
                <ToggleGroup.Item square value="editor" className="z-10 w-full">
                  <Icon size="extra-small">
                    <Pencil2Icon />
                  </Icon>
                </ToggleGroup.Item>
              </Tooltip.Trigger>
            </Tabs.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                {...sideMenuTooltipProps}
                sideOffset={sideMenuTooltipProps.sideOffset + 4}
              >
                Editor öffnen
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tabs.Trigger value="preview" asChild>
              <Tooltip.Trigger asChild>
                <ToggleGroup.Item
                  square
                  value="preview"
                  className="z-10 w-full"
                >
                  <Icon size="extra-small">
                    <PlayIcon />
                  </Icon>
                </ToggleGroup.Item>
              </Tooltip.Trigger>
            </Tabs.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                {...sideMenuTooltipProps}
                sideOffset={sideMenuTooltipProps.sideOffset + 4}
              >
                Preview öffnen
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </ToggleGroup.Root>
      </>
    </Tabs.List>
  );
}
