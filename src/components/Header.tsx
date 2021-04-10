import React from "react";
import { Logo, UserMenu } from "components";
import { CSS, styled } from "utils/stitches.config";

const Container = styled("div", {
  backgroundColor: "$gray100",
  paddingInline: "$4",
  paddingBlock: "$2",
  boxShadow: "$md",

  "@md": {
    paddingInline: "$8",
  },
});

const Content = styled("header", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

type HeaderProps = {
  css?: CSS;
};

export const Header: React.FC<HeaderProps> = ({ children, css }) => {
  return (
    <Container css={css}>
      <Content className="space-x-8">
        <Logo />
        {children}
        <UserMenu imgSrc="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80" />
      </Content>
    </Container>
  );
};
