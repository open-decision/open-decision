import * as React from "react";
import {
  Box,
  Stack as StackImpl,
  StackProps,
  styled,
} from "@open-legal-tech/design-system";

import { Meta, Story } from "@storybook/react";

const StyledBox = styled(Box, {
  border: "1px solid $gray7",
  backgroundColor: "$gray2",
  padding: "$4",
});

export default {
  component: StackImpl,
  title: "Components/Layout/Stack",
} as Meta;

const StackTemplate: Story<StackProps> = (props) => (
  <StackImpl {...props} css={{ gap: "$5" }}>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
  </StackImpl>
);

export const Stack = StackTemplate.bind({});
