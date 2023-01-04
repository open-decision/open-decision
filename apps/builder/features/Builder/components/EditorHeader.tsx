import {
  DropdownMenu,
  FileInput,
  Icon,
  Row,
} from "@open-decision/design-system";
import { ProjectMenu } from "../../../components/ProjectMenu/ProjectMenu";
import { BaseHeader } from "../../../components";
import dynamic from "next/dynamic";
import { Tree } from "@open-decision/tree-type";
import { BlendingModeIcon } from "@radix-ui/react-icons";
import { useTreeClient } from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { PrototypButton } from "./PrototypButton";

type HeaderProps = {
  className?: string;
  treeId: string;
  children?: React.ReactNode;
};

const NodeSearch = dynamic(() => import("./NodeSearch"), { ssr: false });

export const EditorHeader = ({ className, treeId, children }: HeaderProps) => {
  const treeClient = useTreeClient();
  const t = useTranslations("common");

  return (
    <BaseHeader
      className={className}
      LogoSlot={
        <ProjectMenu
          tree={treeId}
          Items={({ setDropdownOpen }) => (
            <DropdownMenu.Item
              onSelect={(event) => {
                event.preventDefault();
              }}
            >
              <FileInput
                Icon={
                  <Icon>
                    <BlendingModeIcon />
                  </Icon>
                }
                onChange={(event) => {
                  const fileReader = new FileReader();
                  fileReader.onload = function (event) {
                    const result = event.target?.result;

                    if (!result || !(typeof result === "string")) throw result;
                    const parsedResult = JSON.parse(result);

                    const validatedResult =
                      Tree.Type.shape.theme.safeParse(parsedResult);

                    if (!validatedResult.success) {
                      console.error(validatedResult.error);
                      setDropdownOpen(false);
                      throw validatedResult;
                    }

                    if (validatedResult.data) {
                      treeClient.updateTheme(validatedResult.data);
                    }

                    setDropdownOpen(false);
                  };

                  if (!event.currentTarget.files?.[0]) return;
                  fileReader.readAsText(event.currentTarget.files[0]);
                  event.target.value = "";
                }}
              >
                {t("projectMenu.uploadTheme")}
              </FileInput>
            </DropdownMenu.Item>
          )}
        />
      }
    >
      <Row className="gap-3 items-center w-full justify-between">
        <NodeSearch />
        <PrototypButton treeId={treeId} />
      </Row>
      {children}
    </BaseHeader>
  );
};
