import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Field, Form, Textarea } from "@open-legal-tech/design-system";
import { VariantProps } from "@stitches/react";

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
    <Textarea {...props} name="test" />
    <Textarea {...props} name="another" disabled />
    <Field label="Testinput">
      <Textarea {...props} name="test2" size="large" rows={10} />
    </Field>
  </Form>
);
