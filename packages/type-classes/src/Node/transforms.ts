import * as BuilderNode from "./BuilderNode";
import * as PublicNode from "./PublicNode";
import { mapValues, pipe } from "remeda";

export const TransformToPublicNodes = BuilderNode.Record.transform((nodes) =>
  mapValues(nodes, ({ position: _position, ...node }) => node)
);
