import { Component } from "@internalTypes/global";
import React from "react";
import { Header } from "./Header";

type Layout = {
  footer?: boolean;
};

export const Layout: Component<Layout> = ({ children, footer = true }) => {
  return (
    <div className="grid grid-rows-layout h-screen">
      <Header />
      {children}
      {footer ? <footer>Footer content</footer> : null}
    </div>
  );
};
