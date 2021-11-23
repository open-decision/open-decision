import * as BuilderNode from "./BuilderNode";
import { mapValues } from "remeda";

export const TransformToPublicNodes = BuilderNode.Record.transform((nodes) =>
  mapValues(nodes, ({ position: _position, ...node }) => node)
);
