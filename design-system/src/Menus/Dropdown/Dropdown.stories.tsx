import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { DropdownMenu } from "./Dropdown";
import { IconButton } from "../../Button/IconButton";
import { Icon } from "../../Icon/Icon";
import { Menu } from "../../icons";
import { Settings } from "react-feather";

export default {
  component: DropdownMenu.Root,
  title: "Components/DropdownMenu",
  decorators: [(Component) => <Component />],
} as Meta;

const Template: Story<
  Omit<React.ComponentProps<typeof DropdownMenu.Root>, "css">
> = (props) => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(false);

  return (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="tertiary" Icon={<Menu />} label="Open Menu" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={5} css={{ width: "max-content" }} loop>
        <DropdownMenu.Item>
          <Icon label="Settings" css={{ padding: 0 }}>
            <Settings />
          </Icon>
          Test
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Icon label="Settings" css={{ padding: 0 }}>
            <Settings />
          </Icon>
          Second Option
        </DropdownMenu.Item>
        <DropdownMenu.CheckboxItem
          checked={bookmarksChecked}
          onCheckedChange={setBookmarksChecked}
        >
          Second Option
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Label>Test Label</DropdownMenu.Label>
        <DropdownMenu.Item>
          <Icon label="Settings" css={{ padding: 0 }}>
            <Settings />
          </Icon>
          Another One
        </DropdownMenu.Item>
        <DropdownMenu.Root>
          <DropdownMenu.TriggerItem>
            <Icon label="Settings" css={{ padding: 0 }}>
              <Settings />
            </Icon>
            Last Test Option
          </DropdownMenu.TriggerItem>
          <DropdownMenu.Content alignOffset={-10}>
            <DropdownMenu.Item>
              <Icon label="Settings" css={{ padding: 0 }}>
                <Settings />
              </Icon>
              Another One
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export const Medium = Template.bind({});
