import React from "react";
import { Button, Field, Logo } from "@components/index";
import { Component } from "@internalTypes/global";

export const LoginCard: Component = () => {
  const [login, setLogin] = React.useState(true);

  return (
    <div className="w-full max-w-xs">
      <div className="bg-white shadow-xl rounded-lg mb-4 flex flex-col overflow-hidden">
        <div className="flex justify-center items-center p-8 bg-gradient-to-r from-gray-200 to-gray-400">
          <Logo />
        </div>
        {/* <Button onClick={(e) => setLogin(!login)}>Toggle</Button> */}
        {login ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

const LoginForm = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <form className="mt-8 flex flex-col space-y-6">
      <div className="p-6 space-y-4">
        <Field
          name="email"
          label="E-Mail"
          value={email}
          setValue={setEmail}
          type="email"
          required
        />
        <Field
          name="password"
          label="Passwort"
          value={password}
          setValue={setPassword}
          type="password"
          required
        />
      </div>
      <div className="flex justify-center">
        <a
          className="block font-bold text-sm text-blue-500 hover:text-blue-800"
          href="#"
        >
          Passwort vergessen?
        </a>
      </div>
      <Button className="h-20" rounded={false}>
        Log-In
      </Button>
    </form>
  );
};

const SignupForm = () => {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password1, setPassword1] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  return (
    <form>
      <Field
        name="email"
        label="E-Mail"
        value={email}
        setValue={setEmail}
        type="email"
        required
      />
      <Field
        name="name"
        label="Name"
        value={name}
        setValue={setName}
        type="text"
        required
      />
      <Field
        name="password"
        label="Passwort"
        value={password1}
        setValue={setPassword1}
        type="password"
        required
      />
      <Field
        name="password"
        label="Passwort wiederholen"
        value={password2}
        setValue={setPassword2}
        type="password"
        required
      />
      <Button>Log-In</Button>
    </form>
  );
};
