import * as React from "react";
import {
  Box,
  Cover as CoverImpl,
  CoverProps,
  styled,
} from "@open-legal-tech/design-system";

import { Meta, Story } from "@storybook/react";

const StyledBox = styled(Box, {
  border: "1px solid $gray7",
  backgroundColor: "$gray2",
  padding: "$4",
});

export default {
  component: CoverImpl,
  title: "Components/Layout/Cover",
} as Meta;

const CoverTemplate: Story<CoverProps> = (props) => (
  <CoverImpl {...props} css={{ gap: "$5" }}>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox className="cover">Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
  </CoverImpl>
);

export const Cover = CoverTemplate.bind({});
