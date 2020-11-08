import React from "react";
import {
  LoginButton,
  LogoutButton,
  useAuthToken,
  SignupButton,
} from "@features/index";
import { Logo, Menu } from "@components/index";

const AuthButtons = ({ className = "" }) => {
  const [getToken] = useAuthToken();
  const token = getToken();

  return token ? (
    <LogoutButton className={className} />
  ) : (
    <>
      <LoginButton className={className} />
      <SignupButton className={className} />
    </>
  );
};

export const Header: React.FC = () => {
  const [getToken] = useAuthToken();
  const token = getToken();

  return (
    <div className="bg-gray-400 px-4 md:px-8 py-2">
      <div className="flex justify-between items-center">
        <Logo />
        <div className="flex items-center space-x-8">
          <Menu
            icon={
              token
                ? "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80"
                : undefined
            }
            links={{
              dropdownLinks: [
                { to: "./profile", text: "Profil" },
                { to: "./settings", text: "Einstellungen" },
              ],
              dropdownButtons: <AuthButtons />,
            }}
          />
        </div>
      </div>
    </div>
  );
};
