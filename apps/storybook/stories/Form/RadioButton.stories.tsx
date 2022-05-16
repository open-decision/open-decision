import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  RadioButton as SystemRadioButton,
  Field,
} from "@open-decision/design-system";

export default {
  component: SystemRadioButton.Item,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const RadioButton: Story<SystemRadioButton.ItemProps> = (props) => (
  <SystemRadioButton.Root name="test">
    <Field
      label="1. Option"
      layout="inline-right"
      css={{ maxWidth: "max-content" }}
    >
      <SystemRadioButton.Item {...props} value="1" />
    </Field>
    <Field label="2. Option" layout="inline-right">
      <SystemRadioButton.Item {...props} value="2" />
    </Field>
    <Field label="3. Option" layout="inline-right">
      <SystemRadioButton.Item {...props} value="3" disabled />
    </Field>
  </SystemRadioButton.Root>
);
