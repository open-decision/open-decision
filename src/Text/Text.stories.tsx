import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Text } from "./index";
import { Box } from "../Box";

export default {
  component: Text,
  title: "Components/Text",
} as Meta;

type Props = Omit<React.ComponentProps<typeof Text>, "css">;

export const List: Story<Props> = (props) => (
  <Box css={{ display: "grid", gap: "$4" }}>
    <Text size="xl" {...props}>
      Culpa qui ipsum nisi eu elit Lorem esse aliquip irure adipisicing anim
      adipisicing. Esse nisi magna eu reprehenderit qui duis magna. Officia non
      sit id aliqua sint qui aute minim sint cupidatat. Sunt sunt excepteur enim
      laboris non laborum occaecat non irure cupidatat dolor do. Lorem dolore
      cillum amet deserunt id ipsum est magna occaecat adipisicing consequat ea
      adipisicing cupidatat.
    </Text>
    <Text size="lg" {...props}>
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
    <Text size="sm" {...props}>
      Culpa qui ipsum nisi eu elit Lorem esse aliquip irure adipisicing anim
      adipisicing. Esse nisi magna eu reprehenderit qui duis magna. Officia non
      sit id aliqua sint qui aute minim sint cupidatat. Sunt sunt excepteur enim
      laboris non laborum occaecat non irure cupidatat dolor do. Lorem dolore
      cillum amet deserunt id ipsum est magna occaecat adipisicing consequat ea
      adipisicing cupidatat.
    </Text>
    <Text size="xs" {...props}>
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

export const ExtraLarge = Template.bind({});
ExtraLarge.args = { size: "xl" };
export const Large = Template.bind({});
Large.args = { size: "lg" };
export const Default = Template.bind({});
export const Small = Template.bind({});
Small.args = { size: "sm" };
export const ExtraSmall = Template.bind({});
ExtraSmall.args = { size: "xs" };
