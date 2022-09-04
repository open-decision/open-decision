import * as React from "react";
import {
  Tabs,
  ToggleGroup,
  Icon,
  StyleObject,
  Tooltip,
} from "@open-decision/design-system";
import { Pencil2Icon, PlayIcon } from "@radix-ui/react-icons";
import { sideMenuTooltipProps } from "./shared";

type Props = { css?: StyleObject; selectedView: string };

export function ViewToggle({ selectedView, css }: Props) {
  return (
    <Tabs.List asChild>
      <>
        <ToggleGroup.Root
          type="single"
          defaultValue={selectedView}
          value={selectedView}
          layout="vertical"
          css={{ ...css }}
        >
          <Tooltip.Root>
            <Tabs.Trigger value="editor" asChild>
              <Tooltip.Trigger asChild>
                <ToggleGroup.Item square value="editor" css={{ zIndex: "$10" }}>
                  <Icon>
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
                <Tooltip.Title>Editor öffnen</Tooltip.Title>
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tabs.Trigger value="preview" asChild>
              <Tooltip.Trigger asChild>
                <ToggleGroup.Item
                  square
                  value="preview"
                  css={{ zIndex: "$10" }}
                >
                  <Icon>
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
                <Tooltip.Title>Preview öffnen</Tooltip.Title>
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </ToggleGroup.Root>
      </>
    </Tabs.List>
  );
}
