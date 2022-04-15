import {
  darkTheme,
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
import { MenuButton } from "components/Header/MenuButton";
import { UpdateTreeDialog } from "features/Dashboard/components/Dialogs/UpdateTreeDialog";
import { useGetTreeNameQuery } from "features/Data/generated/graphql";
import { useTreeId } from "features/Data/useTreeId";
import NextLink from "next/link";

type Props = { css?: StyleObject };

export function ProjectMenu({ css }: Props) {
  const id = useTreeId();

  const { data } = useGetTreeNameQuery({ uuid: id });

  const name =
    (data?.decisionTree?.name.length ?? "") > 60
      ? data?.decisionTree?.name.slice(0, 60).concat("...")
      : data?.decisionTree?.name;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <MenuButton label={name} css={css} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={15}
        alignOffset={-4}
        className={darkTheme}
        css={{ groupColor: "$white" }}
      >
        <DropdownMenu.Item>
          <Icon>
            <ArrowLeftIcon />
          </Icon>
          <NextLink href="/" passHref>
            <Link>Zurück zum Dashboard</Link>
          </NextLink>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <UpdateTreeDialog treeId={id}>
          <DropdownMenu.Item>
            <Icon>
              <Pencil2Icon />
            </Icon>
            Namen ändern
          </DropdownMenu.Item>
        </UpdateTreeDialog>
        <DropdownMenu.Item>
          <Icon>
            <Share2Icon />
          </Icon>
          Exportieren
        </DropdownMenu.Item>
        <DropdownMenu.Item css={{ colorScheme: "danger" }}>
          <Icon>
            <TrashIcon />
          </Icon>
          Projekt löschen
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
