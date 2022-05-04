import * as React from "react";
import { SpinnerCircular } from "spinners-react";
import { Icon } from "../Icon/Icon";
import { ColorKeys } from "../internal/utils";
import { StyleObject, theme } from "../stitches";

type Props = {
  colorScheme?: ColorKeys;
  size?: React.CSSProperties["fontSize"];
  css?: StyleObject;
};

export function LoadingSpinner({ colorScheme = "primary", size, css }: Props) {
  return (
    <Icon label="Lädt" css={{ fontSize: size ?? "1.3em", ...css }}>
      <SpinnerCircular
        color={theme.colors[`${colorScheme}11`].value}
        secondaryColor={theme.colors[`${colorScheme}4`].value}
        style={{ width: "100%", height: "100%" }}
      />
    </Icon>
  );
}
