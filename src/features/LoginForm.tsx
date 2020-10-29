import React from "react";
import { FunctionComponent } from "react";
import { LoginButton } from "./Auth/LoginButton";
import { Input } from "@components/index";

export const LoginForm: FunctionComponent = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            E-Mail
          </label>
          <Input
            id="email"
            value={email}
            setValue={setEmail}
            type="email"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Passwort
          </label>
          <Input
            id="password"
            value={password}
            setValue={setPassword}
            type="password"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <LoginButton email={email} password={password} />
          <a
            className="inline-block align-baseline font-bold text-sm  text-blue-500 hover:text-blue-800"
            href="#"
          >
            Passwort vergessen?
          </a>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2020 Acme Corp. All rights reserved.
      </p>
    </div>
  );
};
