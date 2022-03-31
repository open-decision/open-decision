import { DeepPartial } from "utility-types";
import { z } from "zod";
import * as Relation from "../Relation/Relation";
import { v4 as uuidV4 } from "uuid";

// export type JSONContent = {
//   type?: string;
//   attrs?: Record<string, any>;
//   content?: JSONContent[];
//   marks?: {
//     type: string;
//     attrs?: Record<string, any>;
//     [key: string]: any;
//   }[];
//   text?: string;
//   [key: string]: any;
// };

// export type HTMLContent = string;

// export type RichTextContent = HTMLContent | JSONContent | JSONContent[] | null;

// const JSONContent: z.ZodSchema<JSONContent> = z.lazy(() =>
//   z.object({
//     type: z.string().optional(),
//     attrs: z.record(z.any()).optional(),
//     content: z.array(JSONContent),
//     marks: z
//       .array(
//         z.object({
//           type: z.string(),
//           attrs: z.record(z.any()).optional(),
//         })
//       )
//       .optional(),
//     text: z.string().optional(),
//   })
// );

// export const RichTextContent = z.union([
//   JSONContent,
//   z.array(JSONContent),
//   z.string(),
//   z.null(),
// ]);

export const Coordinates = z.object({ x: z.number(), y: z.number() });

export const Type = z.object({
  id: z.string().uuid(),
  position: Coordinates,
  data: z.object({
    name: z.string().optional(),
    content: z.any(),
    relations: Relation.Array,
  }),
  type: z.literal("customNode"),
});

export const Array = z.array(Type);

type nodeData = {
  position?: TNode["position"];
  data: {
    relations?: TNodeData["relations"];
    name?: string;
  };
} & DeepPartial<TNode>;

export function create({
  position = { x: 0, y: 0 },
  data: { relations = [], name = "" },
  ...node
}: nodeData): TNode {
  return {
    id: uuidV4(),
    data: {
      relations,
      name,
    },
    type: "customNode",
    position,
    ...node,
  };
}

export function createNewAssociatedNode(
  node: TNode,
  newNode: nodeData,
  nodeHeight = 80
): TNode {
  const deplacement = Object.values(node.data.relations).length - 1;

  const position = {
    x: node.position.x + 220 * deplacement,
    y: node.position.y + nodeHeight + 50,
  };

  return create({
    ...newNode,
    position,
  });
}

// ------------------------------------------------------------------
// Types

export type TNode = z.infer<typeof Type>;
export type TNodesArray = z.infer<typeof Array>;
export type TNodeData = TNode["data"];
export type TCoordinates = z.infer<typeof Coordinates>;
