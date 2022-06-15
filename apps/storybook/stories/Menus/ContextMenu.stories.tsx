import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Settings } from "react-feather";
import { Box, ContextMenu, Icon } from "@open-decision/design-system";

export default {
  component: ContextMenu.Root,
  parameters: {
    layout: "centered",
  },
} as Meta;

const Template: Story<React.ComponentProps<typeof ContextMenu.Root>> = (
  props
) => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(false);

  return (
    <ContextMenu.Root {...props}>
      <ContextMenu.Trigger asChild>
        <Box
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textStyle: "medium-heading",
            height: "500px",
            width: "1000px",
            border: "4px dashed $colors$primary5",
          }}
        >
          Context Menu right click area
        </Box>
      </ContextMenu.Trigger>
      <ContextMenu.Content sideOffset={5} css={{ width: "max-content" }} loop>
        <ContextMenu.Item>
          <Icon label="Settings" css={{ padding: 0 }}>
            <Settings />
          </Icon>
          Test
        </ContextMenu.Item>
        <ContextMenu.Item>
          <Icon label="Settings" css={{ padding: 0 }}>
            <Settings />
          </Icon>
          Second Option
        </ContextMenu.Item>
        <ContextMenu.CheckboxItem
          checked={bookmarksChecked}
          onCheckedChange={setBookmarksChecked}
        >
          Second Option
        </ContextMenu.CheckboxItem>
        <ContextMenu.Label>Test Label</ContextMenu.Label>
        <ContextMenu.Item>
          <Icon label="Settings" css={{ padding: 0 }}>
            <Settings />
          </Icon>
          Another One
        </ContextMenu.Item>
        <ContextMenu.Root>
          <ContextMenu.TriggerItem>
            <Icon label="Settings" css={{ padding: 0 }}>
              <Settings />
            </Icon>
            Last Test Option
          </ContextMenu.TriggerItem>
          <ContextMenu.Content>
            <ContextMenu.Item>
              <Icon label="Settings" css={{ padding: 0 }}>
                <Settings />
              </Icon>
              Another One
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

export const Medium = Template.bind({});
