import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteDecisionTree, RelatedDecisionTreeModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const PublishedTreeModel = z.object({
  uuid: z.string(),
  createdAt: z.date(),
  name: z.string(),
  treeData: jsonSchema,
  /**
   * @TypeGraphQL.omit(output: true, input: true)
   */
  ownerUuid: z.string(),
  originTreeUuid: z.string(),
})

export interface CompletePublishedTree extends z.infer<typeof PublishedTreeModel> {
  owner: CompleteUser
  originTree: CompleteDecisionTree
}

/**
 * RelatedPublishedTreeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPublishedTreeModel: z.ZodSchema<CompletePublishedTree> = z.lazy(() => PublishedTreeModel.extend({
  /**
   * @TypeGraphQL.omit(output: true, input: true)
   */
  owner: RelatedUserModel,
  originTree: RelatedDecisionTreeModel,
}))
