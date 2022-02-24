import React from "react";
import { Logo } from "components";
import {
  StyleObject,
  styled,
  Box,
  darkTheme,
} from "@open-legal-tech/design-system";
import { UserMenu } from "./UserMenu";

const Container = styled("div", {
  layer: "1",
  paddingInline: "$4",
});

const Content = styled("header", {
  display: "flex",
  alignItems: "center",
  gap: "$6",
  groupColor: "$gray11",
  paddingBlock: "$3",
});

type BaseHeaderProps = { children?: React.ReactNode; css?: StyleObject };

export const BaseHeader = ({ children, css }: BaseHeaderProps) => {
  return (
    <Container css={css} className={darkTheme}>
      <Content>
        <Logo css={{ width: "40px", height: "40px" }} />
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
