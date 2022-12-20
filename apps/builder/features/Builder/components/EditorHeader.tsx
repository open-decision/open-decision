import { Row } from "@open-decision/design-system";
import { ProjectMenu } from "../../../components/ProjectMenu/ProjectMenu";
import { BaseHeader } from "../../../components";
import dynamic from "next/dynamic";

type HeaderProps = {
  className?: string;
  treeId: string;
  children?: React.ReactNode;
};

const NodeSearch = dynamic(() => import("./NodeSearch"), { ssr: false });

export const EditorHeader = ({ className, treeId, children }: HeaderProps) => {
  return (
    <BaseHeader className={className} LogoSlot={<ProjectMenu tree={treeId} />}>
      <Row className="gap-3 items-center w-full">
        <NodeSearch />
      </Row>
      {children}
    </BaseHeader>
  );
};
