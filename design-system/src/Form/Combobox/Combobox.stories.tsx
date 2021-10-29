import * as React from "react";
import { Meta } from "@storybook/react";
import { Combobox } from "./index";
import { Input, InlineInput } from "../Inputs";
import { Form } from "../Form";

export default {
  component: Combobox.Root,
  title: "Components/Inputs/Combobox",
} as Meta;

const Template = ({ Input }) => {
  const [selectedItem, setSelectedItem] = React.useState("123");
  const [inputValue, setInputValue] = React.useState("");
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
      initialValues={{ combobox: selectedItem ?? "" }}
      onChange={({ values }) => setSelectedItem(values.combobox)}
    >
      <Combobox.Root
        name="combobox"
        onCreate={handleItemCreate}
        onInputValueChange={(inputValue) => setInputValue(inputValue)}
        resetOnBlur
        items={items}
      >
        <Combobox.Input>{Input}</Combobox.Input>
      </Combobox.Root>
    </Form>
  );
};

export const Default = Template.bind({});
Default.args = {
  Input: <Input name="combobox" />,
};

export const Inline = Template.bind({});
Inline.args = {
  Input: <InlineInput name="combobox" />,
};
