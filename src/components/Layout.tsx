import React from "react";
import { Header } from "components";
import { Notifications } from "features";
import { styled, ComponentProps } from "@open-legal-tech/design-system";
import { styled } from "@open-legal-tech/design-system";

const AppContainer = styled("div", {
  display: "grid",
  height: "100vh",
  gridTemplateRows: "max-content 1fr",
});

export const MainContent = styled("main", {
  display: "flex",
  gridColumn: "1 / -1",
  gridRow: "2",
});

export const Layout = ({
  children,
}: ComponentProps<typeof AppContainer>): JSX.Element => {
  return (
    <AppContainer>
      <Header css={{ gridRow: "1", gridColumn: "1 / -1" }} />
      <Notifications />
      {children}
    </AppContainer>
  );
};
