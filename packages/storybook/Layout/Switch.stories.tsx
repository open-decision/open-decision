import * as React from "react";
import {
  Box,
  Switch as SwitchImpl,
  SwitchProps,
  styled,
} from "@open-legal-tech/design-system";

import { Meta, Story } from "@storybook/react";

const StyledBox = styled(Box, {
  border: "1px solid $gray7",
  backgroundColor: "$gray2",
  padding: "$4",
});

export default {
  component: SwitchImpl,
  title: "Components/Layout/Switch",
} as Meta;

const SwitchTemplate: Story<SwitchProps> = (props) => (
  <SwitchImpl {...props} threshold="20rem" css={{ gap: "$5" }}>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
  </SwitchImpl>
);

export const Switch = SwitchTemplate.bind({});
