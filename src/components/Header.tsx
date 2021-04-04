import React from "react";
import { Logo, UserMenu } from "components";

export const Header: React.FC = ({ children }) => {
  return (
    <div className="bg-gray-100 px-4 md:px-8 shadow-md z-50 py-2">
      <header className="flex justify-between items-center space-x-8">
        <Logo className="my-4" />
        {children}
        <UserMenu imgSrc="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80" />
      </header>
    </div>
  );
};
