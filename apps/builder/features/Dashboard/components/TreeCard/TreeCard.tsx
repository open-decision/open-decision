import * as React from "react";
import {
  Heading,
  Stack,
  styled,
  Text,
  Badge,
  Row,
  Box,
  intentWithinSelector,
  Icon,
  Link as SystemLink,
} from "@open-decision/design-system";
import { parseISO } from "date-fns";
import Link from "next/link";
import { Card as DefaultCard } from "../../../../components/Card";
import { TreeCardMenu } from "./TreeCardMenu";
import { TGetTreeOutput } from "@open-decision/tree-api-specification";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "../../../Data/useQueryClient";
import { treeQueryKey } from "../../../Data/useTreeAPI";
import { useIntl, useTranslations } from "next-intl";

const Card = styled(Stack, DefaultCard, {
  position: "relative",
  textDecoration: "none",
});

type Props = { tree: TGetTreeOutput };

export function TreeCard({ tree }: Props) {
  const t = useTranslations("dashboard.treeList.treeCard");
  const intl = useIntl();
  const queryClient = useQueryClient();

  return (
    <Box
      css={{
        position: "relative",
        transition: "box-shadow 150ms ease-in",
        borderRadius: "$md",
        [`${intentWithinSelector}`]: { boxShadow: "$3" },
      }}
      as="section"
    >
      <Link
        href={`/builder/${tree.uuid}`}
        title={t("hiddenTitleLink", { name: tree.name })}
      >
        <Card
          css={{ cursor: "pointer" }}
          onClick={() =>
            queryClient.setQueryData(treeQueryKey(tree.uuid), tree)
          }
        >
          <Row
            css={{ gap: "$2", alignItems: "center", marginBottom: "$1" }}
            as="header"
          >
            <Heading size="small" css={{ maxWidth: "70%" }}>
              {tree.name}
            </Heading>
            {tree.status === "ARCHIVED" ? (
              <Badge css={{ colorScheme: "gray" }} size="small">
                {t(tree.status)}
              </Badge>
            ) : null}
            {tree.publishedTrees.length > 0 ? (
              <SystemLink
                onClick={(e) => {
                  e.stopPropagation();
                }}
                href={`${process.env.NEXT_PUBLIC_OD_RENDERER_ENDPOINT}/tree/${tree.publishedTrees[0].uuid}`}
                target="_blank"
              >
                <Badge size="small">
                  {t("published")}{" "}
                  <Icon>
                    <ArrowRightIcon />
                  </Icon>
                </Badge>
              </SystemLink>
            ) : null}
          </Row>
          <Text css={{ color: "$gray11" }} size="small">
            {intl.formatRelativeTime(parseISO(tree.updatedAt))}
          </Text>
        </Card>
      </Link>
      <TreeCardMenu tree={tree} />
    </Box>
  );
}
