import { Greeting } from "components";
import { Button } from "theme-ui";
import React from "react";

//TODO Button + icon is missing => + character is not suitable, because characters have inherent line height (which is basically vertical padding in this case)

export const WelcomeScreen = ({ username, className }) => {
  return (
    <div className={className}>
      <Greeting username={username}></Greeting>
      <Button
        sx={{
          borderRadius: 3,
          padding: 4,
          fontSize: 3,
          marginTop: 4,
          backgroundColor: "tertiary.primary",
          color: "tertiary.contrast",
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Neuen Baum hinzufügen
      </Button>
    </div>
  );
};
