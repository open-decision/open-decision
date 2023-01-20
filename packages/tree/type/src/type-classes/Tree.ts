import {
  ZNodeId,
  TNodeId,
  TEdgeId,
  ZEdgeId,
  ZEntityId,
} from "@open-decision/tree-id";
import { forEachObj } from "remeda";
import { z } from "zod";
import { INode, ZEntityPluginBase, ZNodePlugin } from "../plugin";
import { IEdge, ZEdgePlugin } from "../plugin/EdgePlugin";
import { Theme } from "./Theme";

export const Type = z.object({
  startNode: ZNodeId,
  nodes: z.custom<Record<TNodeId, INode>>((value) => {
    if (!value || typeof value !== "object") return false;

    return forEachObj.indexed(value, (value, key: string) => {
      if (!ZNodePlugin.safeParse(value)) return false;

      if (!ZNodeId.safeParse(key).success) return false;

      return true;
    });
  }),
  edges: z.custom<Record<TEdgeId, IEdge>>((value) => {
    if (!value || typeof value !== "object") return false;

    return forEachObj.indexed(value, (value, key: string) => {
      if (!ZEdgePlugin.safeParse(value).success) return false;

      if (!ZEdgeId.safeParse(key).success) return false;

      return true;
    });
  }),
  pluginEntities: z.record(
    z.record(ZEntityId, ZEntityPluginBase.passthrough())
  ),
  uuid: z.string().uuid(),
  theme: Theme.optional(),
});

export type TTree = z.infer<typeof Type>;
