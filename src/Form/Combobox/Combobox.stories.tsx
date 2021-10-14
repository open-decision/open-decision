import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Combobox, ComboboxProps, Item } from "./index";
import { Form } from "../Form";
import { Input, InlineInput } from "../Inputs";

export default {
  component: Combobox,
  title: "Components/Inputs/Combobox",
} as Meta;

const Template: Story<ComboboxProps<Item>> = ({ Input }) => {
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
    <Form
      initialValues={{
        test: "123",
      }}
      // onChange={({ values }) => console.log(values)}
      css={{ display: "grid", gap: "$2", width: "max-content" }}
    >
      <Combobox items={items} onCreate={handleItemCreate} Input={Input} />
    </Form>
  );
};

export const Default = Template.bind({});
Default.args = {
  Input: <Input name="test" />,
};

export const Inline = Template.bind({});
Inline.args = {
  Input: <InlineInput name="test" />,
};
