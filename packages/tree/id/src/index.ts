import { z } from "zod";

export type TId<TEntity extends string = string> = `${TEntity}_${string}`;
export const ZEntityId = z.custom<TId>((value) => typeof value === "string");

export type TNodeId = TId<"nodes">;

export const ZNodeId = z.custom<TNodeId>(
  (value) => typeof value === "string" && value.includes("nodes")
);

export const isNodeId = (value: any): value is TNodeId => {
  return ZNodeId.safeParse(value).success;
};

export type TEdgeId = TId<"edges">;

export const ZEdgeId = z.custom<TEdgeId>(
  (value) => typeof value === "string" && value.includes("edges")
);

export const isEdgeId = (value: any): value is TEdgeId => {
  return ZEdgeId.safeParse(value).success;
};

export type TInputId = TId<"inputs">;
