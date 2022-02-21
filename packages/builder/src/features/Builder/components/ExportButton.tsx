import * as React from "react";
import {
  Button,
  buttonStyles,
  Link,
  StyleObject,
} from "@open-legal-tech/design-system";
import { readableDate } from "features/Dashboard/utils";
import { useTree } from "../state/treeStore/hooks";

type Props = { css?: StyleObject };

export function ExportButton({ css }: Props) {
  const tree = useTree();

  const file = React.useMemo(
    () =>
      new Blob([JSON.stringify(tree)], {
        type: "application/json",
      }),
    [tree]
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
      download={file ? `${tree.name}_${readableDate(new Date())}.json` : false}
      href={fileDownloadUrl}
      underline={false}
    >
      Export
    </Link>
  );
}
