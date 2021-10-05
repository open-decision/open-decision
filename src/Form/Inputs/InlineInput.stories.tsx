import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { InlineInput } from "./InlineInput";
import { VariantProps } from "@stitches/react";
import { Form } from "../Form";
import { IconButton } from "../../IconButton";
import { X, Check } from "../../icons";

export default {
  component: InlineInput,
  title: "Components/Inputs/InlineInput",
} as Meta;

const sharedProps = {
  Buttons: [
    <IconButton
      alignByContent="right"
      css={{ colorScheme: "error" }}
      Icon={<X />}
      size="small"
      variant="ghost"
      label="Editieren abrrechen"
    />,
    <IconButton
      alignByContent="right"
      css={{ colorScheme: "success" }}
      Icon={<Check />}
      size="small"
      variant="ghost"
      label="Änderungen speichern"
    />,
  ],
};

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
    <InlineInput name="test" {...sharedProps} {...props} />
    <InlineInput
      name="test2"
      minLength={5}
      required
      {...sharedProps}
      {...props}
    />
    <InlineInput name="test3" minLength={5} {...sharedProps} {...props} />
  </Form>
);
