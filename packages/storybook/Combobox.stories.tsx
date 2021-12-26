import * as React from "react";
import { Meta, Story } from "@storybook/react";
import {
  Combobox,
  Form,
  InlineInput,
  Input,
  ComboboxInputProps,
} from "@open-legal-tech/design-system";

export default {
  component: Combobox.Root,
  title: "Components/Inputs/Combobox",
} as Meta;

const Template: Story<ComboboxInputProps> = ({ children }) => {
  const [selectedItem, setSelectedItem] = React.useState("123");
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
    <Form onSubmit={(data) => setSelectedItem(data.combobox.id)}>
      <Combobox.Root
        name="combobox"
        onCreate={handleItemCreate}
        resetOnBlur
        items={items}
      >
        <Combobox.Input>{children}</Combobox.Input>
      </Combobox.Root>
    </Form>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: <Input name="combobox" />,
};

export const Inline = Template.bind({});
Inline.args = {
  children: <InlineInput name="combobox" />,
};
