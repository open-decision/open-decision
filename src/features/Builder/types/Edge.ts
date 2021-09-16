import * as T from "io-ts";
import { Required } from "utility-types";
import * as Option from "fp-ts/Option";

export const Type = T.intersection([
  T.type({
    id: T.string,
    source: T.string,
    target: T.string,
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
    id: createEdgeId(edgeParams),
  };
};

export const EdgesRecord = T.record(T.string, Type);

export type TEdgesRecord = T.TypeOf<typeof EdgesRecord>;
export type TEdge = T.TypeOf<typeof Type>;
