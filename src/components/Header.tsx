import React from "react";
import { Logo } from "components";
import {
  StyleObject,
  styled,
  Box,
  Input,
  Text,
} from "@open-legal-tech/design-system";
import { ChevronDown, Menu } from "react-feather";

const Container = styled("div", {
  backgroundColor: "$gray12",
  paddingInline: "$4",
  paddingBlock: "$2",

  "@md": {
    paddingInline: "$8",
  },
});

const Content = styled("header", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100%",
  $color: "$colors$gray1",
});

type HeaderProps = {
  css?: StyleObject;
};

export const Header: React.FC<HeaderProps> = ({ css }) => {
  return (
    <Container css={css}>
      <Content>
        <Logo variant="dark" />
        <Box css={{ display: "flex", alignItems: "center", gap: "$4" }}>
          <Text as="h2" size="md">
            Projektname:{" "}
          </Text>
          <Input
            css={{
              backgroundColor: "transparent",
              padding: "$1 $2",
              color: "white",
            }}
          />
        </Box>
        <Box css={{ color: "white", display: "flex", gap: "$2" }}>
          <ChevronDown />
          <Menu />
        </Box>
      </Content>
    </Container>
  );
};
