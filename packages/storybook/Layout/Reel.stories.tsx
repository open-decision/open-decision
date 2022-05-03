import * as React from "react";
import {
  Box,
  Reel as ReelImpl,
  ReelProps,
  styled,
} from "@open-decision/design-system";

import { Meta, Story } from "@storybook/react";

const StyledBox = styled(Box, {
  border: "1px solid $gray7",
  backgroundColor: "$gray2",
  padding: "$4",
});

export default {
  component: ReelImpl,
  title: "Components/Layout/Reel",
} as Meta;

const ReelTemplate: Story<ReelProps> = (props) => (
  <ReelImpl {...props} gap="5" padding="4">
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
  </ReelImpl>
);

export const Reel = ReelTemplate.bind({});
