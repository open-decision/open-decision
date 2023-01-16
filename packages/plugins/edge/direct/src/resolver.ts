import { EdgeResolver } from "@open-decision/plugins-edge-helpers";
import { ODError } from "@open-decision/type-classes";
import { IDirectEdge } from "./plugin";

export const directEdgeResolver: EdgeResolver<IDirectEdge> =
  (_treeClient) => (edge) => (_context) => {
    if (!edge.target) return { state: "failure" };

    if (edge) return { state: "success", target: edge.target };

    return {
      state: "error",
      error: new ODError({ code: "MISSING_STARTNODE" }),
    };
  };
