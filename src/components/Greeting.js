import React from "react";
import { Text } from "theme-ui";

export const Greeting = ({ username }) => {
  return <Text sx={{ fontSize: 6, color: "grays.1" }}>Hallo, {username}!</Text>;
};
