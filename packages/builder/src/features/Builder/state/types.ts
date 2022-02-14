import { DeepPartial } from "utility-types";
import {
  BuilderTree,
  BuilderNode,
  BuilderRelation,
} from "@open-decision/type-classes";
import { ActorRefFrom } from "xstate";
import { createSyncMachine } from "./syncMachine/syncMachine";

export type Context = {
  tree: BuilderTree.TTree;
  connectionSourceNode?: BuilderNode.TNode | null;
  validConnections?: BuilderNode.TNode[] | null;
  syncMachineRef: ActorRefFrom<ReturnType<typeof createSyncMachine>> | null;
  patches: BuilderTree.TPatch[];
  undoRedoStack: [BuilderTree.TPatch[], BuilderTree.TPatch[]][];
  undoRedoPosition: number;
};

export type Events =
  | { type: "addNode"; node: BuilderNode.TNode }
  | {
      type: "updateNode";
      node: Partial<BuilderNode.TNode> & { id: BuilderNode.TNode["id"] };
    }
  | { type: "deleteNode"; ids: string[] }
  | {
      type: "addRelation";
      nodeId: string;
      relation: Omit<BuilderRelation.TRelation, "id">;
    }
  | {
      type: "updateRelation";
      nodeId: string;
      relation: Partial<BuilderRelation.TRelation> & {
        id: BuilderRelation.TRelation["id"];
      };
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
  | { type: "abortConnect" }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "patchesReceived" };
