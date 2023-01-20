import * as React from "react";
import {
  Heading,
  Text,
  Badge,
  Icon,
  Button,
  rowClasses,
} from "@open-decision/design-system";
import { formatRelative, parseISO } from "date-fns";
import Link from "next/link";
import { cardClasses } from "../../components/Card";
import { TGetTreeOutput } from "@open-decision/api-specification";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "../Data/useQueryClient";
import { treeQueryKey } from "@open-decision/api-react-binding";
import { useTranslations } from "next-intl";
import { ProjectMenu } from "../../components/ProjectMenu/ProjectMenu";
import { de } from "date-fns/locale";

type Props = { tree: TGetTreeOutput };

export function TreeCard({ tree }: Props) {
  const t = useTranslations("dashboard.treeList.treeCard");
  const queryClient = useQueryClient();

  return (
    <section className="relative rounded-md shadow-2">
      <Link
        href={`/builder/${tree.uuid}`}
        title={t("hiddenTitleLink", { name: tree.name })}
        style={{ textDecoration: "none" }}
        className={cardClasses("relative no-underline cursor-pointer")}
        onClick={() => queryClient.setQueryData(treeQueryKey(tree.uuid), tree)}
      >
        <header className={rowClasses({}, "gap-2 items-center mb-1")}>
          <Heading size="small" className="max-w-[70%]">
            {tree.name}
          </Heading>
          {tree.status === "ARCHIVED" ? (
            <Badge className="colorScheme-gray" size="small">
              {t(tree.status)}
            </Badge>
          ) : null}
          {tree.publishedTrees.length > 0 ? (
            <Badge size="small">{t("published")}</Badge>
          ) : null}
        </header>
        <Text className="text-gray11" size="small">
          {formatRelative(new Date(parseISO(tree.updatedAt)), new Date(), {
            locale: de,
          })}
        </Text>
      </Link>
      <ProjectMenu tree={tree}>
        <Button
          variant="ghost"
          square
          className="absolute right-[20px] top-[20px]"
          size="small"
        >
          <Icon label={t("menu.hiddenLabel", { name: tree.name })}>
            <DotsHorizontalIcon />
          </Icon>
        </Button>
      </ProjectMenu>
    </section>
  );
}
