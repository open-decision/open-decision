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
  backgroundColor: "$gray2",
  paddingInline: "$4",
});

const Content = styled("header", {
  display: "flex",
  alignItems: "center",
  gap: "$6",
  $color: "$colors$gray1",
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
            color: "$gray11",
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
