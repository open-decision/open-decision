import * as React from "react";
import {
  Button,
  buttonStyles,
  Link,
  StyleObject,
} from "@open-legal-tech/design-system";
import { useTree } from "../state/treeMachine/useTree";
import { readableDate } from "features/Dashboard/utils";

type Props = { css?: StyleObject };

export function ExportButton({ css }: Props) {
  const [state] = useTree();

  const file = React.useMemo(
    () =>
      new Blob([JSON.stringify(state.context)], {
        type: "application/json",
      }),
    [state]
  );

  if (file instanceof Error)
    return (
      <Button size="small" variant="secondary" disabled>
        Export
      </Button>
    );

  const fileDownloadUrl = URL.createObjectURL(file);

  return (
    <Link
      className={buttonStyles({ size: "small", variant: "secondary", css })}
      download={
        file ? `${state.context.name}_${readableDate(new Date())}.json` : false
      }
      href={fileDownloadUrl}
      underline={false}
    >
      Export
    </Link>
  );
}
