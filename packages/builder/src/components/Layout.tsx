import React from "react";
import { Notifications } from "features/Notifications/Notifications";
import { styled } from "@open-decision/design-system";

const AppContainer = styled("main", {
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});

export const MainContent = styled("main", {
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
});

export const LayoutImpl = (
  { children, ...props }: React.ComponentProps<typeof AppContainer>,
  ref: React.Ref<HTMLElement>
): JSX.Element => {
  return (
    <AppContainer {...props} ref={ref}>
      <Notifications />
      {children}
    </AppContainer>
  );
};

export const Layout = React.forwardRef(LayoutImpl);
