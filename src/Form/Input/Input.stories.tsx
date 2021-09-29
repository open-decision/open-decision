import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Input as SystemInput } from "./Input";
import { VariantProps } from "@stitches/react";
import { Form } from "../Form";

export default {
  component: SystemInput,
  title: "Components/Inputs/Input",
} as Meta;

type Props = VariantProps<typeof SystemInput>;

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
    <SystemInput name="test" {...props} />
    <SystemInput name="another" disabled {...props} />
    <SystemInput name="test2" minLength={5} required {...props} />
    <SystemInput name="test3" minLength={5} {...props} />
  </Form>
);
