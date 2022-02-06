import { theme } from "@open-legal-tech/design-system";
import { ColorKeys } from "@open-legal-tech/design-system/src/internal/utils";
import { SpinnerCircular } from "spinners-react";

type Props = { colorScheme?: ColorKeys };

export function LoadingSpinner({ colorScheme = "primary" }: Props) {
  return (
    <SpinnerCircular
      color={theme.colors[`${colorScheme}11`].value}
      secondaryColor={theme.colors[`${colorScheme}4`].value}
    />
  );
}
