import React from "react";
import { Header } from "./Header";

type Layout = {
  header?: boolean;
};

export const Layout: React.FunctionComponent<Layout> = ({
  children,
  header = true,
}) => {
  return (
    <div className="grid grid-rows-layout h-screen">
      {header ? <Header /> : <div />}
      {children}
    </div>
  );
};
