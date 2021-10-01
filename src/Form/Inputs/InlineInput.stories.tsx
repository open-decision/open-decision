import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { InlineInput } from "./InlineInput";
import { VariantProps } from "@stitches/react";
import { Form } from "../Form";

export default {
  component: InlineInput,
  title: "Components/Inputs/InlineInput",
} as Meta;

type Props = VariantProps<typeof InlineInput>;

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
    <InlineInput name="test" {...props} />
    <InlineInput name="another" disabled {...props} />
    <InlineInput name="test2" minLength={5} required {...props} />
    <InlineInput name="test3" minLength={5} {...props} />
  </Form>
);
