import { Component } from "@internalTypes/global";
import React from "react";
import { Header } from "./Header";

export const Layout: Component = ({ children }) => {
  return (
    <div className="grid grid-rows-layout h-screen">
      <Header />
      {children}
    </div>
  );
};
