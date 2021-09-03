import { pipe } from "fp-ts/function";
import * as T from "io-ts";
import { Required } from "utility-types";
import { TTree } from "./Tree";
import * as Option from "fp-ts/Option";
import * as Either from "fp-ts/Either";

const EdgeType = T.intersection([
  T.type({
    id: T.string,
    source: T.string,
    target: T.string,
    /** Represents the relationships between an Edge and at least one {@link Input}. An Edge can only exist with at least one
     * Input associated with it.
     */
    inputs: T.array(
      T.type({
        /** Since an Input is always part of a {@link Node} we add the nodeId to the relationship.*/
        nodeId: T.string,
        /** The id of the {@link Input} on the source node of the Edge.*/
        inputId: T.string,
      })
    ),
  }),
  T.partial({
    type: T.string,
    label: T.string,
    animated: T.boolean,
    isHidden: T.boolean,
  }),
]);

type getEdgeParameters = Required<Partial<TEdge>, "source" | "target">;

const createEdgeId = ({ source, target }: getEdgeParameters): string =>
  `${source}-${target}`;

const validEdge = (edges: TEdgesRecord) => (edge: TEdge) => {
  const maybeEdge = Option.fromNullable(edges[createEdgeId(edge)]);

  if (Option.isNone(maybeEdge)) return Option.some(edge);

  return Option.none;
};

const createEdge = (edgeParams: Omit<TEdge, "id">): TEdge => {
  return {
    ...edgeParams,
    id: createEdgeId(edgeParams),
  };
};

const getEdgeByPartialEdge = (edge: getEdgeParameters) => (tree: TTree) =>
  pipe(
    tree.edges[createEdgeId({ source: edge.source, target: edge.target })],
    Option.fromNullable
  );

const getEdge = (edgeId: string) => (tree: TTree) =>
  Option.fromNullable(tree.edges[edgeId]);

export const Edge = {
  Type: EdgeType,
  createEdgeId,
  validEdge,
  createEdge,
  getEdge,
  getEdgeByPartialEdge,
};

export const EdgesRecord = T.record(T.string, EdgeType);

export type TEdgesRecord = T.TypeOf<typeof EdgesRecord>;
export type TEdge = T.TypeOf<typeof EdgeType>;

// /**
//  * A new edge should only be created if:
//  * - A source and a target a specified
//  * - The same edge does not already exist
//  *
//  * This function handles that logic
//  */
// export const tryAddEdge =
//   (edges: TEdgesRecord) =>
//   (edge: TEdge): Either<string, TEdge> => {
//     if (connectionExists(edge, Object.values(edges))) {
//       return left("Connection already exists");
//     }

//     return right(edge);
//   };
