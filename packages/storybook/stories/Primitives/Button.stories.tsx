import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  Button,
  ButtonProps,
  Grid,
  Heading,
  Icon,
  Row,
} from "@open-decision/design-system";
import { Plus } from "react-feather";

export default {
  component: Button,
  parameters: {
    layout: "centered",
  },
} as Meta;

Heading.defaultProps = {
  size: "small",
  css: { justifySelf: "end" },
};

const ButtonGrid: Story<Omit<ButtonProps, "css">> = (props) => (
  <Grid
    css={{
      gridTemplateColumns: "max-content 1fr",
      gap: "$8",
    }}
  >
    <Heading>Small</Heading>
    <Row css={{ gap: "$4" }}>
      <Button size="small" {...props} />
      <Button size="small" square {...props}>
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <Button size="small" square round {...props}>
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <Button size="small" {...props}>
        <Icon>
          <Plus />
        </Icon>{" "}
        Button
      </Button>
    </Row>
    <Heading>Medium</Heading>
    <Row css={{ gap: "$4" }}>
      <Button {...props} />
      <Button square {...props}>
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <Button square round {...props}>
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <Button {...props}>
        <Icon>
          <Plus />
        </Icon>{" "}
        Button
      </Button>
    </Row>
    <Heading>Large</Heading>
    <Row css={{ gap: "$4" }}>
      <Button size="large" {...props} />
      <Button size="large" square {...props}>
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <Button size="large" square round {...props}>
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <Button size="large" {...props}>
        <Icon>
          <Plus />
        </Icon>{" "}
        Button
      </Button>
    </Row>
    <Heading>Xl</Heading>
    <Row css={{ gap: "$4" }}>
      <Button size="xl" {...props} />
      <Button size="xl" square {...props}>
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <Button size="xl" square round {...props}>
        <Icon>
          <Plus />
        </Icon>
      </Button>
      <Button size="xl" {...props}>
        <Icon>
          <Plus />
        </Icon>{" "}
        Button
      </Button>
    </Row>
  </Grid>
);

export const Primary = ButtonGrid.bind({});
Primary.args = { children: "Button" };

export const Secondary = ButtonGrid.bind({});
Secondary.args = { variant: "secondary", children: "Button" };

export const Tertiary = ButtonGrid.bind({});
Tertiary.args = { variant: "tertiary", children: "Button" };
