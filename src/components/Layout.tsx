import React, { FC } from "react";
import { Header } from "components";
import { authService, Notifications } from "features";
import { styled } from "utils/stitches.config";
import { useService } from "@xstate/react";
import { LoginPage } from "features/Data/LoginPage";

const AppContainer = styled("div", {
  display: "grid",
  minHeight: "100vh",
  gridTemplateRows: "max-content 1fr",
});

const ContentContainer = styled("main", {
  display: "grid",
  gridTemplateColumns: "1fr 10fr 1fr",
});

export const MainContent = styled("div", {
  gridColumn: "1 / -1",
  gridRow: "1 / -1",
});

export const Layout: React.FunctionComponent = ({ children }) => {
  return (
    <AppContainer>
      <Header />
      <ContentContainer>
        <Authenticated>{children}</Authenticated>
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
