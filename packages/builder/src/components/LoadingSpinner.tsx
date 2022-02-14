import { theme } from "@open-legal-tech/design-system";
import { ColorKeys } from "@open-legal-tech/design-system/src/internal/utils";
import { SpinnerCircular } from "spinners-react";

type Props = { colorScheme?: ColorKeys; width?: React.CSSProperties["width"] };

export function LoadingSpinner({
  colorScheme = "primary",
  width = "max-content",
}: Props) {
  return (
    <SpinnerCircular
      style={{ width }}
      color={theme.colors[`${colorScheme}11`].value}
      secondaryColor={theme.colors[`${colorScheme}4`].value}
    />
  );
}
