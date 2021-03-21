import React from "react";
import { Header } from "components";
export const Layout: React.FunctionComponent = ({ children }) => {
  return (
    <div
      className="grid h-screen"
      style={{ gridTemplateRows: "max-content 1fr" }}
    >
      <Header />
      {children}
    </div>
  );
};
