import { StyleObject, Row } from "@open-decision/design-system";
import { ProjectMenu } from "../../../components/ProjectMenu/ProjectMenu";
import { BaseHeader } from "../../../components";
import dynamic from "next/dynamic";

type HeaderProps = {
  css?: StyleObject;
  treeId: string;
  children?: React.ReactNode;
};

const NodeSearch = dynamic(() => import("./NodeSearch"), { ssr: false });

export const EditorHeader = ({ css, treeId, children }: HeaderProps) => {
  return (
    <BaseHeader css={css} LogoSlot={<ProjectMenu tree={treeId} />}>
      <Row css={{ gap: "$3", alignItems: "center", width: "100%" }}>
        <NodeSearch />
      </Row>
      {children}
    </BaseHeader>
  );
};
