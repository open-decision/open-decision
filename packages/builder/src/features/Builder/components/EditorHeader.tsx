import {
  Box,
  buttonStyles,
  StyleObject,
  Link as SystemLink,
} from "@open-legal-tech/design-system";
import { BaseHeader } from "components";
import { TreeNameInput } from "./TreeNameInput";
import Link from "next/link";
import { ExportButton } from "./ExportButton";

type HeaderProps = {
  css?: StyleObject;
};

export const EditorHeader = ({ css }: HeaderProps) => {
  return (
    <BaseHeader css={css}>
      <TreeNameInput />
      <Box css={{ display: "flex", gap: "$2", marginLeft: "auto" }}>
        <Link passHref href="/vorschau">
          <SystemLink
            className={buttonStyles({ variant: "tertiary", size: "small" })}
          >
            Vorschau
          </SystemLink>
        </Link>
        <ExportButton />
      </Box>
    </BaseHeader>
  );
};
