import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  Field,
  Checkbox as SystemCheckbox,
  CheckboxProps,
} from "@open-decision/design-system";

export default {
  component: SystemCheckbox,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const Checkbox: Story<CheckboxProps> = (props) => {
  return (
    <Field label="Testlabel" layout="inline-right">
      <SystemCheckbox {...props} name="test.box1" />
    </Field>
  );
};
