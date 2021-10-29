import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Textarea } from "./Textarea";
import { VariantProps } from "@stitches/react";
import { Form } from "../Form";
import { Field } from "./Field";

export default {
  component: Textarea,
  title: "Components/Inputs/Textarea",
} as Meta;

type Props = VariantProps<typeof Textarea>;

export const Input: Story<Props> = (props) => (
  <Form
    initialValues={{
      test: "",
      another: "",
      test2: "existing value",
      test3: "",
    }}
    onSubmit={({ values }) => alert(values)}
    css={{ display: "grid", gap: "$2", width: "max-content" }}
  >
    <Textarea name="test" {...props} />
    <Textarea name="another" disabled {...props} />
    <Field label="Testinput">
      <Textarea name="test2" size="large" rows={10} {...props} />
    </Field>
  </Form>
);
