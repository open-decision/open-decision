import { Button, Icon, StyleObject } from "@open-legal-tech/design-system";
import * as React from "react";
import { HelpCircle } from "react-feather";

type Props = { css?: StyleObject };

export function ThemingButton({ css }: Props) {
  return (
    <Button round size="large" css={css}>
      <Icon label="Start Theming">
        <HelpCircle />
      </Icon>
    </Button>
  );
}
