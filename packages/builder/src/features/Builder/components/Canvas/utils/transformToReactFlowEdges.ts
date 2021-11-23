import * as Record from "fp-ts/Record";
import * as Array from "fp-ts/Array";
import * as Option from "fp-ts/Option";
import { fromEquals } from "fp-ts/Eq";
import { pipe } from "fp-ts/function";
import { Connection, BuilderNode } from "@open-decision/type-classes";

export const eqEdge = (a: Connection.TConnection, b: Connection.TConnection) =>
  a.source === b.source && a.target === b.target;

export const transformToReactFlowEdges = (
  nodes: BuilderNode.TNodesRecord,
  selectedNodeId?: string,
  selectedRelation?: string
) => {
  return pipe(
    nodes,
    Record.toArray,
    Array.chain(([, node]) =>
      pipe(
        node.relations,
        Record.toArray,
        Array.filterMap(([, relation]) =>
          Option.fromNullable(
            relation.target
              ? Connection.create({
                  source: node.id,
                  target: relation.target,
                  style: {
                    stroke:
                      selectedNodeId === node.id &&
                      selectedRelation === relation.id
                        ? "var(--colors-primary9)"
                        : relation.answer
                        ? "var(--colors-gray9)"
                        : "var(--colors-gray7)",
                  },
                })
              : null
          )
        ),
        Array.uniq(fromEquals(eqEdge))
      )
    )
  );
};
