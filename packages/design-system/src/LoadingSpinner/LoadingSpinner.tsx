import * as React from "react";
import { SpinnerCircular } from "spinners-react";
import { Icon } from "../Icon/Icon";
import { ColorKeys } from "../internal/utils";
import { theme } from "../stitches";

type Props = {
  colorScheme?: ColorKeys;
  size?: React.CSSProperties["fontSize"];
};

export function LoadingSpinner({ colorScheme = "primary", size }: Props) {
  return (
    <Icon label="Lädt" css={{ fontSize: size ?? "1.3em" }}>
      <SpinnerCircular
        color={theme.colors[`${colorScheme}11`].value}
        secondaryColor={theme.colors[`${colorScheme}4`].value}
      />
    </Icon>
  );
}
