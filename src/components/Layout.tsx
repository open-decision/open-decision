import React from "react";
import { Header } from "components";
import { Notifications } from "features";
import { styled } from "utils/stitches.config";

const AppContainer = styled("div", {
  display: "grid",
  minHeight: "100vh",
  gridTemplateRows: "max-content 1fr",
  gap: "$10",
});

const ContentContainer = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 10fr 1fr",
});

const Content = styled("div", {
  gridColumn: "1 / -1",
  gridRow: "1 / -1",
});

export const Layout: React.FunctionComponent = ({ children }) => {
  return (
    <AppContainer>
      <Header />
      <ContentContainer>
        <Content>{children}</Content>
        <Notifications
          css={{
            gridRow: "1",
            gridColumn: "1 / -1",
            justifySelf: "center",
          }}
        />
      </ContentContainer>
    </AppContainer>
  );
};
