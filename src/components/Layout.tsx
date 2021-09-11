import React from "react";
import { Notifications } from "features/Notifications/Notifications";
import { styled } from "@open-legal-tech/design-system";

const AppContainer = styled("div", {
  display: "flex",
  height: "100vh",
});

export const MainContent = styled("main", {});

export const Layout = ({
  children,
}: React.ComponentProps<typeof AppContainer>): JSX.Element => {
  return (
    <AppContainer>
      <Notifications />
      {children}
    </AppContainer>
  );
};
