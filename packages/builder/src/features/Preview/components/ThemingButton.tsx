import { IconButton, StyleObject } from "@open-legal-tech/design-system";
import * as React from "react";
import { HelpCircle } from "react-feather";

type Props = { css?: StyleObject };

export function ThemingButton({ css }: Props) {
  return (
    <IconButton
      round
      size="large"
      Icon={<HelpCircle />}
      label="Start Theming"
      css={css}
    />
  );
}
