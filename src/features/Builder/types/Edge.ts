import { pipe } from "fp-ts/function";
import * as T from "io-ts";
import { Required } from "utility-types";
import { TTree } from "./Tree";
import * as Option from "fp-ts/Option";

export const Type = T.intersection([
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

export const createEdgeId = ({ source, target }: getEdgeParameters): string =>
  `${source}-${target}`;

export const validEdge = (edges: TEdgesRecord) => (edge: TEdge) => {
  const maybeEdge = Option.fromNullable(edges[createEdgeId(edge)]);

  if (Option.isNone(maybeEdge)) return Option.some(edge);

  return Option.none;
};

export const createEdge = (edgeParams: Omit<TEdge, "id">): TEdge => {
  return {
    ...edgeParams,
    type: "smoothstep",
    id: createEdgeId(edgeParams),
  };
};

export const getEdgeByPartialEdge =
  (edge: getEdgeParameters) => (tree: TTree) =>
    pipe(
      tree.edges[createEdgeId({ source: edge.source, target: edge.target })],
      Option.fromNullable
    );

export const getEdge = (edgeId: string) => (tree: TTree) =>
  Option.fromNullable(tree.edges[edgeId]);

export const EdgesRecord = T.record(T.string, Type);

export type TEdgesRecord = T.TypeOf<typeof EdgesRecord>;
export type TEdge = T.TypeOf<typeof Type>;
