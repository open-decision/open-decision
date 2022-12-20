import { MissingEdgeForThruthyConditionError } from "@open-decision/interpreter";
import { EdgeResolver } from "@open-decision/plugins-edge-helpers";
import { TDirectEdge } from "./index";

export const resolver: EdgeResolver<TDirectEdge> =
  (_treeClient) => (edge) => (_context) => {
    if (!edge.target) return { state: "failure" };

    if (edge) return { state: "success", target: edge.target };

    return { state: "error", error: new MissingEdgeForThruthyConditionError() };
  };
