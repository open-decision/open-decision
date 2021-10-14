import * as Connection from "../types/Connection";
import { TNodesRecord } from "../types/Node";
import * as Record from "fp-ts/Record";
import * as Array from "fp-ts/Array";
import * as Option from "fp-ts/Option";
import { fromEquals } from "fp-ts/Eq";
import { pipe } from "fp-ts/function";

export const eqEdge = (a: Connection.TConnection, b: Connection.TConnection) =>
  a.source === b.source && a.target === b.target;

export const createEdges = (nodes: TNodesRecord, selectedNodeId?: string) => {
  return pipe(
    nodes,
    Record.toArray,
    Array.chain(([, node]) =>
      pipe(
        node.data.relations,
        Record.toArray,
        Array.filterMap(([, relation]) =>
          Option.fromNullable(
            relation.target
              ? Connection.create({
                  source: node.id,
                  target: relation.target,
                  style: {
                    stroke:
                      selectedNodeId === node.id
                        ? "var(--colors-primary9)"
                        : relation.value
                        ? "var(--colors-gray9)"
                        : "var(--colors-gray8)",
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
