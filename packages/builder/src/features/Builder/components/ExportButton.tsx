import * as React from "react";
import {
  Button,
  buttonStyles,
  Link,
  StyleObject,
} from "@open-legal-tech/design-system";
import { useTree } from "../state/useTree";
import { TransformToPublicTree } from "@open-decision/type-classes";
import { readableDate } from "features/Dashboard/utils";

type Props = { css?: StyleObject };

export function ExportButton({ css }: Props) {
  const [tree] = useTree();
  const [file, _setFile] = React.useState(() => {
    const PublicTree = TransformToPublicTree(tree.context);
    if (PublicTree.success)
      return new Blob([JSON.stringify(PublicTree.data)], {
        type: "application/json",
      });

    return PublicTree.error;
  });

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
        file
          ? `${tree.context.treeName}_${readableDate(new Date())}.json`
          : false
      }
      href={fileDownloadUrl}
    >
      Export
    </Link>
  );
}
