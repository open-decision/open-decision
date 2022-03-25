import * as React from "react";
import {
  Button,
  buttonStyles,
  disabledStyle,
  Link,
  StyleObject,
} from "@open-decision/design-system";
import { readableDate } from "features/Dashboard/utils";
import { useTreeData } from "../state/treeStore/hooks";

type Props = { css?: StyleObject };

export function ExportButton({ css }: Props) {
  // const tree = useTreeData();

  // const file = React.useMemo(
  //   () =>
  //     new Blob([JSON.stringify(tree)], {
  //       type: "application/json",
  //     }),
  //   [tree]
  // );

  // if (file instanceof Error)
  //   return (
  //     <Button variant="secondary" disabled>
  //       Export
  //     </Button>
  //   );

  // const fileDownloadUrl = URL.createObjectURL(file);

  return (
    <Button variant="secondary" disabled>
      Export
    </Button>
  );

  // return (
  //   <Link
  //     className={buttonStyles({ variant: "secondary", css })}
  //     download={file ? `${tree.name}_${readableDate(new Date())}.json` : false}
  //     href={fileDownloadUrl}
  //     underline={false}
  //   >
  //     Export
  //   </Link>
  // );
}
