import React, { FC } from "react";
import { Header } from "components";
import { authService, Notifications } from "features";
import { styled } from "utils/stitches.config";
import { useService } from "@xstate/react";
import { LoginPage } from "features/Data/LoginPage";

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

export const Layout: React.FunctionComponent = ({ children }) => {
  return (
    <AppContainer>
      <Header css={{ gridRow: "1", gridColumn: "1 / -1" }} />
      <Notifications />
      <Authenticated>{children}</Authenticated>
    </AppContainer>
  );
};

const Authenticated: FC = ({ children }) => {
  const [state] = useService(authService);

  return state.matches("unknown") ? (
    <MainContent>Loading ...</MainContent>
  ) : state.matches("loggedIn") ? (
    <>{children}</>
  ) : (
    <LoginPage />
  );
};
