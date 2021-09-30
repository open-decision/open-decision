import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Combobox } from "./index";
import { VariantProps } from "@stitches/react";
import { Form } from "../Form";

export default {
  component: Combobox,
  title: "Components/Inputs/Combobox",
} as Meta;

type Props = VariantProps<typeof Combobox>;

export const Input: Story<Props> = (props) => (
  <Form
    initialValues={{
      test: "",
    }}
    onSubmit={({ values }) => alert(values)}
    css={{ display: "grid", gap: "$2", width: "max-content" }}
  >
    <Combobox
      name="test"
      items={["test", "another one", "a third thingy"]}
      selectedItem="test"
    />
  </Form>
);
