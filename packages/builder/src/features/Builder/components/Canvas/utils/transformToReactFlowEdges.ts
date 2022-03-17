import { record, array, option, eq } from "fp-ts";
import { pipe } from "remeda";
import * as Connection from "./Connection";
import { BuilderNode } from "@open-decision/type-classes";

export const eqEdge = (a: Connection.TConnection, b: Connection.TConnection) =>
  a.source === b.source && a.target === b.target;

export const transformToReactFlowEdges = (
  nodes: BuilderNode.TNodesRecord,
  selectedNodeId?: string,
  selectedRelation?: string
) => {
  return pipe(
    nodes,
    record.toArray,
    array.chain(([, node]) =>
      pipe(
        node.relations,
        record.toArray,
        array.filterMap(([, relation]) =>
          option.fromNullable(
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
        array.uniq(eq.fromEquals(eqEdge))
      )
    )
  );
};
