/**@jsx jsx */
import React from "react";
import { Input, jsx, Label, Container, Flex } from "theme-ui";
import { FunctionComponent } from "react";
import { LoginButton } from "./Auth/LoginButton";

export const Login: FunctionComponent = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <Container
      variant="stack"
      sx={{
        justifyContent: "center",
        alignContent: "center",
        gridGap: 5,
      }}
    >
      <h1>Login</h1>
      <Label>
        E-Mail
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
      </Label>
      <Label>
        Passwort
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
      </Label>
      <Flex sx={{ justifyContent: "space-between" }}>
        <LoginButton email={email} password={password} />
      </Flex>
    </Container>
  );
};
