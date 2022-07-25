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
import { formatRelative, parseISO } from "date-fns";
import Link from "next/link";
import de from "date-fns/locale/de";
import { Card as DefaultCard } from "../../../../components/Card";
import { TreeCardMenu } from "./TreeCardMenu";
import { TGetTreeOutput } from "@open-decision/tree-api-specification";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "../../../Data/useQueryClient";
import { treeQueryKey } from "../../../Data/useTreeQuery";

const readableStatus = {
  ACTIVE: "AKTIV",
  ARCHIVED: "ARCHIVIERT",
};

const Card = styled(Stack, DefaultCard, {
  position: "relative",
  textDecoration: "none",
});

type Props = { tree: TGetTreeOutput };

export function TreeCard({ tree }: Props) {
  const queryClient = useQueryClient();

  return (
    <Box
      css={{
        position: "relative",
        transition: "box-shadow 150ms ease-in",
        borderRadius: "$md",
        [`${intentWithinSelector}`]: { boxShadow: "$3" },
      }}
    >
      <Card>
        <Row css={{ gap: "$2", alignItems: "center", marginBottom: "$1" }}>
          <Link
            href={`/builder/${tree.uuid}`}
            title={`Öffne das Projekt ${tree.name}`}
            onClick={() =>
              queryClient.setQueryData(treeQueryKey(tree.uuid), tree)
            }
          >
            <Heading size="small" css={{ cursor: "pointer" }}>
              {tree.name}
            </Heading>
          </Link>

          {tree.status === "ACTIVE" ? (
            <Badge size="small">{readableStatus[tree.status]}</Badge>
          ) : null}
          {tree.status === "ARCHIVED" ? (
            <Badge css={{ colorScheme: "gray" }} size="small">
              {readableStatus[tree.status]}
            </Badge>
          ) : null}
          {tree.publishedTrees.length > 0 ? (
            <SystemLink
              href={`${process.env.NEXT_PUBLIC_OD_RENDERER_ENDPOINT}/tree/${tree.publishedTrees[0].uuid}`}
              target="_blank"
              onClick={(event) => event.stopPropagation()}
            >
              <Badge size="small">
                VERÖFFENTLICHT{" "}
                <Icon>
                  <ArrowRightIcon />
                </Icon>
              </Badge>
            </SystemLink>
          ) : null}
        </Row>
        <Text css={{ color: "$gray11" }} size="small">
          {formatRelative(parseISO(tree.updatedAt), new Date(), {
            locale: de,
          })}
        </Text>
      </Card>
      <TreeCardMenu tree={tree} />
    </Box>
  );
}
