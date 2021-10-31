import * as React from "react";
import { Meta, Story } from "@storybook/react";
import {
  IconButton,
  InlineInput,
  InlineInputProps,
  Form,
} from "@open-legal-tech/design-system";
import { Edit2 } from "react-feather";

export default {
  component: InlineInput,
  title: "Components/Inputs/InlineInput",
} as Meta;

const Input: Story<InlineInputProps> = (props) => (
  <Form
    initialValues={{
      test: "Verfassungsrecht",
    }}
    onSubmit={({ values }) => alert(values)}
    css={{ display: "grid", gap: "$2" }}
  >
    <InlineInput
      {...props}
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
    />
  </Form>
);

export const Default = Input.bind({});
