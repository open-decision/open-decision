import * as React from "react";
import { Meta, Story } from "@storybook/react";
import {
  InlineInput,
  InlineInputProps,
  Form,
  Icon,
  Button,
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
        <Button
          variant="tertiary"
          size="small"
          css={{ colorScheme: "primary" }}
        >
          <Icon label="Editieren">
            <Edit2 />
          </Icon>
        </Button>
      }
      name="test"
    />
  </Form>
);

export const Default = Input.bind({});
