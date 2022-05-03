import React from "react";
import { StyleObject, styled, darkTheme } from "@open-decision/design-system";
import { UserMenu } from "./UserMenu";

const Container = styled("div", {
  layer: "1",
  paddingInline: "$4",
});

const Content = styled("header", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
  groupColor: "$gray12",
  paddingBlock: "$3",
});

type BaseHeaderProps = {
  children?: React.ReactNode;
  css?: StyleObject;
  LogoSlot?: React.ReactNode;
};

export const BaseHeader = ({ children, css, LogoSlot }: BaseHeaderProps) => {
  return (
    <Container css={css} className={darkTheme}>
      <Content>
        {LogoSlot}
        {children}
        <UserMenu />
      </Content>
    </Container>
  );
};
