import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { InlineInput, InlineInputProps } from "./InlineInput";
import { Form } from "../Form";
import { IconButton } from "../../Button/IconButton";
import { X, Check, Edit2 } from "../../icons";

export default {
  component: InlineInput,
  title: "Components/Inputs/InlineInput",
} as Meta;

const Input: Story<Omit<InlineInputProps, "css">> = (props) => (
  <Form
    initialValues={{
      test: "Verfassungsrecht",
    }}
    onSubmit={({ values }) => alert(values)}
    css={{ display: "grid", gap: "$2", width: "max-content" }}
  >
    <InlineInput
      IndicatorButton={
        <IconButton
          variant="tertiary"
          size="small"
          label="Editieren"
          css={{ colorScheme: "primary" }}
          Icon={<Edit2 />}
        />
      }
      name="test"
      {...props}
    />
  </Form>
);

export const Default = Input.bind({});
