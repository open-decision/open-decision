import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Text, TextProps } from "./index";
import { Box } from "../Box";
import { VariantProps } from "@stitches/react";

export default {
  component: Text,
  title: "Components/Text",
} as Meta;

export const List: Story<TextProps> = (props) => (
  <Box css={{ display: "grid", gap: "$4" }}>
    <Text size="large" {...props}>
      Culpa qui ipsum nisi eu elit Lorem esse aliquip irure adipisicing anim
      adipisicing. Esse nisi magna eu reprehenderit qui duis magna. Officia non
      sit id aliqua sint qui aute minim sint cupidatat. Sunt sunt excepteur enim
      laboris non laborum occaecat non irure cupidatat dolor do. Lorem dolore
      cillum amet deserunt id ipsum est magna occaecat adipisicing consequat ea
      adipisicing cupidatat.
    </Text>
    <Text {...props}>
      Culpa qui ipsum nisi eu elit Lorem esse aliquip irure adipisicing anim
      adipisicing. Esse nisi magna eu reprehenderit qui duis magna. Officia non
      sit id aliqua sint qui aute minim sint cupidatat. Sunt sunt excepteur enim
      laboris non laborum occaecat non irure cupidatat dolor do. Lorem dolore
      cillum amet deserunt id ipsum est magna occaecat adipisicing consequat ea
      adipisicing cupidatat.
    </Text>
    <Text size="small" {...props}>
      Culpa qui ipsum nisi eu elit Lorem esse aliquip irure adipisicing anim
      adipisicing. Esse nisi magna eu reprehenderit qui duis magna. Officia non
      sit id aliqua sint qui aute minim sint cupidatat. Sunt sunt excepteur enim
      laboris non laborum occaecat non irure cupidatat dolor do. Lorem dolore
      cillum amet deserunt id ipsum est magna occaecat adipisicing consequat ea
      adipisicing cupidatat.
    </Text>
    <Text size="extra-small" {...props}>
      Culpa qui ipsum nisi eu elit Lorem esse aliquip irure adipisicing anim
      adipisicing. Esse nisi magna eu reprehenderit qui duis magna. Officia non
      sit id aliqua sint qui aute minim sint cupidatat. Sunt sunt excepteur enim
      laboris non laborum occaecat non irure cupidatat dolor do. Lorem dolore
      cillum amet deserunt id ipsum est magna occaecat adipisicing consequat ea
      adipisicing cupidatat.
    </Text>
  </Box>
);

const Template: Story<Props> = (props) => (
  <Text {...props}>
    Culpa qui ipsum nisi eu elit Lorem esse aliquip irure adipisicing anim
    adipisicing. Esse nisi magna eu reprehenderit qui duis magna. Officia non
    sit id aliqua sint qui aute minim sint cupidatat. Sunt sunt excepteur enim
    laboris non laborum occaecat non irure cupidatat dolor do. Lorem dolore
    cillum amet deserunt id ipsum est magna occaecat adipisicing consequat ea
    adipisicing cupidatat.
  </Text>
);

export const Large = Template.bind({});
Large.args = { size: "large" };
export const Default = Template.bind({});
export const Small = Template.bind({});
Small.args = { size: "small" };

const ShortTemplate: Story<Props> = (props) => (
  <Text {...props}>Culpa qui ipsum</Text>
);
export const Overline = ShortTemplate.bind({});
Overline.args = { type: "overline" };
export const Caption = ShortTemplate.bind({});
Caption.args = { type: "caption" };
