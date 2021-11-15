import * as React from "react";
import { Button, ButtonProps } from "@open-legal-tech/design-system";

export function ExportButton(props: ButtonProps) {
  return (
    <Button size="small" variant="secondary" {...props}>
      Export
    </Button>
  );
}
