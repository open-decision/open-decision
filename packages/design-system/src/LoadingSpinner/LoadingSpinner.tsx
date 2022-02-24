import { SpinnerCircular } from "spinners-react";
import { Icon } from "../Icon/Icon";
import { ColorKeys } from "../internal/utils";
import { theme } from "../stitches";

type Props = { colorScheme?: ColorKeys; width?: React.CSSProperties["width"] };

export function LoadingSpinner({ colorScheme = "primary" }: Props) {
  return (
    <Icon label="Lädt">
      <SpinnerCircular
        color={theme.colors[`${colorScheme}11`].value}
        secondaryColor={theme.colors[`${colorScheme}4`].value}
      />
    </Icon>
  );
}
