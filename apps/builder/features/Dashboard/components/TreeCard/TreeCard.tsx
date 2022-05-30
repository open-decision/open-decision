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
} from "@open-decision/design-system";
import { formatRelative, parseISO } from "date-fns";
import de from "date-fns/locale/de";
import Link from "next/link";
import { Card as DefaultCard } from "../../../../components/Card";
import { TreeCardMenu } from "./TreeCardMenu";
import { TGetTreeOutput } from "@open-decision/tree-api-specification";

const readableStatus = {
  ACTIVE: "AKTIV",
  ARCHIVED: "ARCHIVIERT",
};

const Card = styled("a", Stack, DefaultCard, {
  position: "relative",
  textDecoration: "none",
});

type Props = { tree: TGetTreeOutput };

export function TreeCard({ tree }: Props) {
  return (
    <Box
      css={{
        position: "relative",
        transition: "box-shadow 150ms ease-in",
        borderRadius: "$md",
        [`${intentWithinSelector}`]: { boxShadow: "$3" },
      }}
    >
      <Link href={`/builder/${tree.uuid}`} passHref>
        <Card title={`Öffne das Projekt ${tree.name}`}>
          <Row css={{ gap: "$2", alignItems: "center", marginBottom: "$1" }}>
            <Heading size="small">{tree.name}</Heading>
            {tree.status === "ACTIVE" ? (
              <Badge size="small">{readableStatus[tree.status]}</Badge>
            ) : null}
            {tree.status === "ARCHIVED" ? (
              <Badge css={{ colorScheme: "gray" }} size="small">
                {readableStatus[tree.status]}
              </Badge>
            ) : null}
            {tree.publishedTrees.length > 0 ? (
              <Badge size="small">VERÖFFENTLICHT</Badge>
            ) : null}
          </Row>
          <Text css={{ color: "$gray11" }} size="small">
            {formatRelative(parseISO(tree.updatedAt), new Date(), {
              locale: de,
            })}
          </Text>
        </Card>
      </Link>
      <TreeCardMenu tree={tree} />
    </Box>
  );
}
