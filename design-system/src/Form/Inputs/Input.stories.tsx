import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Input as SystemInput } from "./Input";
import { VariantProps } from "@stitches/react";
import { Form } from "../Form";
import { Field } from "./Field";
import { ArrowRight, Search } from "../../icons";
import { IconButton } from "../../Button/IconButton";
import { Icon } from "../../Icon/Icon";

export default {
  component: SystemInput,
  title: "Components/Inputs/Input",
} as Meta;

type Props = VariantProps<typeof SystemInput>;

const Input: Story<Props> = (props) => (
  <Form
    initialValues={{ test: "" }}
    onChange={({ values }) => console.log(values.test)}
    css={{ display: "grid", gap: "$2", width: "max-content" }}
  >
    <SystemInput name="test" {...props} />
    <Field label="Testinput">
      <SystemInput name="test" {...props} />
    </Field>
  </Form>
);

export const Default = Input.bind({});
export const WithIcon = Input.bind({});
WithIcon.args = {
  Icon: (
    <Icon label="Suche" alignByContent="left">
      <Search />
    </Icon>
  ),
};

export const WithButtons = Input.bind({});
WithButtons.args = {
  Buttons: [
    <IconButton
      size="small"
      variant="tertiary"
      label="Remove Content"
      Icon={<ArrowRight />}
    />,
  ],
};
export const WithButtonsAndIcons = Input.bind({});
WithButtonsAndIcons.args = {
  Icon: (
    <Icon label="Suche" alignByContent="left">
      <Search />
    </Icon>
  ),
  Buttons: [
    <IconButton
      size="small"
      variant="tertiary"
      label="Remove Content"
      Icon={<ArrowRight />}
    />,
  ],
};
