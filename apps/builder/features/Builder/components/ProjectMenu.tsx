import {
  darkTheme,
  defaultTheme,
  DropdownMenu,
  Icon,
  Link,
  StyleObject,
} from "@open-decision/design-system";
import {
  ArrowLeftIcon,
  Pencil2Icon,
  Share2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { MenuButton } from "../../../components/Header/MenuButton";
import { DeleteTreeDialog } from "../../../features/Dashboard/components/Dialogs/DeleteTreeDialog";
import { UpdateTreeDialog } from "../../../features/Dashboard/components/Dialogs/UpdateTreeDialog";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { ExportDialog } from "./ExportDialog";
import { useTreeAPI } from "../../Data/useTreeAPI";
import { useTranslations } from "next-intl";

type Props = { css?: StyleObject; treeId: string };

export function ProjectMenu({ css, treeId }: Props) {
  const t = useTranslations("builder");
  const router = useRouter();

  const { data: name } = useTreeAPI().useTreeQuery(treeId, {
    select: ({ data }) => data.name,
  });

  return (
    <DropdownMenu.Root
      dialogs={{
        export: (
          <ExportDialog
            className={defaultTheme}
            css={{ groupColor: "$black" }}
            treeId={treeId}
          />
        ),
        update: (
          <UpdateTreeDialog
            className={defaultTheme}
            treeId={treeId}
            css={{ groupColor: "$black" }}
          />
        ),
        delete: (
          <DeleteTreeDialog
            className={defaultTheme}
            css={{ groupColor: "$black" }}
            tree={{ uuid: treeId, name: name ?? "Kein Name" }}
            onDeleteAsync={() => router.push("/")}
          />
        ),
      }}
    >
      <DropdownMenu.Trigger asChild>
        <MenuButton label={name} css={css} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={15}
        alignOffset={-4}
        className={darkTheme}
        css={{ groupColor: "$white" }}
      >
        <NextLink href="/" passHref>
          <DropdownMenu.Item asChild>
            <Link>
              <Icon>
                <ArrowLeftIcon />
              </Icon>
              {t("projectMenu.backToDashboard")}
            </Link>
          </DropdownMenu.Item>
        </NextLink>
        <DropdownMenu.Separator />
        <UpdateTreeDialog treeId={treeId}>
          <DropdownMenu.DialogItem dialogKey="update">
            <Icon>
              <Pencil2Icon />
            </Icon>
            {t("projectMenu.changeName")}{" "}
          </DropdownMenu.DialogItem>
        </UpdateTreeDialog>
        <DropdownMenu.DialogItem dialogKey="export">
          <Icon>
            <Share2Icon />
          </Icon>
          {t("projectMenu.export")}
        </DropdownMenu.DialogItem>
        <DropdownMenu.DialogItem
          dialogKey="delete"
          css={{ colorScheme: "danger" }}
        >
          <Icon>
            <TrashIcon />
          </Icon>
          {t("projectMenu.delete")}
        </DropdownMenu.DialogItem>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
