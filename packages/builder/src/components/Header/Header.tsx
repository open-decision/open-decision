import React from "react";
import { Logo } from "components";
import {
  StyleObject,
  styled,
  Box,
  darkTheme,
} from "@open-decision/design-system";
import { UserMenu } from "./UserMenu";

const Container = styled("div", {
  layer: "1",
  paddingInline: "$4",
});

const Content = styled("header", {
  display: "flex",
  alignItems: "center",
  gap: "$6",
  groupColor: "$gray12",
  paddingBlock: "$3",
});

type BaseHeaderProps = {
  children?: React.ReactNode;
  css?: StyleObject;
  LogoSlot?: React.ReactNode;
};

export const BaseHeader = ({
  children,
  css,
  LogoSlot = <Logo css={{ width: "40px", height: "40px" }} />,
}: BaseHeaderProps) => {
  return (
    <Container css={css} className={darkTheme}>
      <Content>
        {LogoSlot}
        <Box
          css={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          {children}
        </Box>
        <UserMenu />
      </Content>
    </Container>
  );
};
