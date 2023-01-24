import { z } from "zod";

export type TId<TEntity extends string = string> = `${TEntity}_${string}`;
export const ZEntityId = z.custom<TId>((value) => typeof value === "string");

export type TNodeId = TId<"node">;

export const ZNodeId = z.custom<TNodeId>(
  (value) => typeof value === "string" && value.includes("node")
);

export const isNodeId = (value: any): value is TNodeId => {
  return ZNodeId.safeParse(value).success;
};

export type TEdgeId = TId<"edge">;

export const ZEdgeId = z.custom<TEdgeId>(
  (value) => typeof value === "string" && value.includes("edge")
);

export const isEdgeId = (value: any): value is TEdgeId => {
  return ZEdgeId.safeParse(value).success;
};

export const ZInputId = z.custom<TInputId>(
  (value) => typeof value === "string" && value.includes("input")
);

export type TInputId = TId<"input">;
