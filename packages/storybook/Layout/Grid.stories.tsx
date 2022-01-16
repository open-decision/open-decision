import * as React from "react";
import {
  Box,
  Grid as GridImpl,
  GridProps,
  styled,
} from "@open-legal-tech/design-system";

import { Meta, Story } from "@storybook/react";

const StyledBox = styled(Box, {
  border: "1px solid $gray7",
  backgroundColor: "$gray2",
  padding: "$4",
});

export default {
  component: GridImpl,
  title: "Components/Layout/Grid",
} as Meta;

const GridTemplate: Story<GridProps> = (props) => (
  <GridImpl {...props} gap="5" minimumColumnWidth="500px">
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
    <StyledBox>Test</StyledBox>
  </GridImpl>
);

export const Grid = GridTemplate.bind({});
