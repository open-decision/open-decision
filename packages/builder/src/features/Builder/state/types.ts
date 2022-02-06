import { DeepPartial } from "utility-types";
import {
  BuilderTree,
  BuilderNode,
  BuilderRelation,
} from "@open-decision/type-classes";
import { ActorRefFrom } from "xstate";
import { createSyncMachine } from "./syncMachine";

export type Context = BuilderTree.TTree & {
  connectionSourceNode?: BuilderNode.TNode;
  validConnections?: BuilderNode.TNode[];
  syncMachineRef: ActorRefFrom<ReturnType<typeof createSyncMachine>>;
};

export type Events =
  | { type: "addNode"; value: BuilderNode.TNode }
  | {
      type: "updateNode";
      id: string;
      node: Partial<BuilderNode.TNode>;
    }
  | { type: "deleteNode"; ids: string[] }
  | {
      type: "addRelation";
      nodeId: string;
      relation?: Omit<BuilderRelation.TRelation, "id">;
    }
  | {
      type: "updateRelation";
      nodeId: string;
      relationId: string;
      relation?: Partial<BuilderRelation.TRelation>;
    }
  | {
      type: "deleteRelation";
      nodeId: string;
      relationIds: string[];
    }
  | { type: "selectNode"; nodeId: string }
  | {
      type: "updateTree";
      tree: DeepPartial<BuilderTree.TTree>;
    }
  | { type: "selectRelation"; id: string }
  | { type: "startConnecting"; sourceNodeId: string }
  | { type: "connect"; target: string }
  | { type: "abortConnect" };
