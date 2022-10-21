import * as React from "react";
import { SpinnerCircular } from "spinners-react";
import { Icon } from "../Icon/Icon";
import { ColorKeys } from "../internal/utils";
import { StyleObject, theme } from "../stitches";
import { CheckCircledIcon } from "@radix-ui/react-icons";

type Props = {
  colorScheme?: ColorKeys;
  size?: React.CSSProperties["fontSize"];
  css?: StyleObject;
  isLoading?: boolean;
};

export function LoadingSpinner({
  colorScheme = "primary",
  size,
  css,
  isLoading = true,
}: Props) {
  return (
    <Icon
      label="Lädt"
      css={{ fontSize: size ?? "1.3em", color: "$primary11", ...css }}
    >
      {isLoading ? (
        <SpinnerCircular
          color={theme.colors[`${colorScheme}11`].value}
          secondaryColor={theme.colors[`${colorScheme}4`].value}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <CheckCircledIcon />
      )}
    </Icon>
  );
}
