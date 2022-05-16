import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Combobox, Input } from "@open-decision/design-system";

export default {
  component: Combobox.Root,
} as Meta;

const Template: Story<Combobox.ComboboxInputProps> = ({ children }) => {
  const [items, setItems] = React.useState([
    { id: "123", label: "test" },
    { id: "1234", label: "another one" },
    { id: "12345", label: "a third thingy" },
    { id: "12312", label: "last one" },
    { id: "3524523", label: "whatever" },
    { id: "34564356", label: "oho" },
  ]);

  const handleItemCreate = (itemLabel: string) => {
    const newItem = { label: itemLabel, id: Math.random().toString() };
    setItems((currItems) => [...currItems, newItem]);

    return newItem;
  };

  return (
    <Combobox.Root name="combobox" onCreate={handleItemCreate} items={items}>
      <Combobox.Input>{children}</Combobox.Input>
    </Combobox.Root>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: <Input name="combobox" />,
};
