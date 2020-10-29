import React from "react";
import { Header } from "./Header";

export const Layout: React.FC = ({ children }) => {
  return (
    <div className="grid grid-rows-layout h-screen">
      <Header />
      {children}
      <footer>Footer content</footer>
    </div>
  );
};
