import React from "react";
import { Header } from "./Header";

export const Layout: React.FunctionComponent = ({ children }) => {
  return (
    <div
      className="grid h-screen"
      style={{ gridTemplateRows: "auto 1fr auto" }}
    >
      <Header />
      {children}
    </div>
  );
};
