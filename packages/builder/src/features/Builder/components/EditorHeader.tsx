import {
  StyleObject,
  Row,
  buttonStyles,
  Icon,
} from "@open-decision/design-system";
import { BaseHeader } from "components";
import { ProjectMenu } from "./ProjectMenu";
import { NodeSearch } from "./NodeSearch";
import { PreviewLink } from "./PreviewLink";
import { FileTextIcon } from "@radix-ui/react-icons";

type HeaderProps = {
  css?: StyleObject;
};

export const EditorHeader = ({ css }: HeaderProps) => {
  return (
    <BaseHeader css={css} LogoSlot={<ProjectMenu />}>
      <Row css={{ gap: "$3", alignItems: "center", width: "100%" }}>
        <NodeSearch />
      </Row>
      <PreviewLink className={buttonStyles({ variant: "secondary" })}>
        <Icon>
          <FileTextIcon />
        </Icon>
        Vorschau
      </PreviewLink>
    </BaseHeader>
  );
};
