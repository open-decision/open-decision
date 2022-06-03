import isJWT from "validator/lib/isJWT";
import { z } from "zod";
import { DecisionTreeModel } from "@open-decision/models/zod";

export const TreeOutput = DecisionTreeModel.omit({
  treeData: true,
  yDocument: true,
}).extend({
  publishedTrees: z.array(z.object({ uuid: z.string().uuid() })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AuthHeader = z.object({
  authorization: z.custom<`Bearer ${string}`>((val) => {
    if (typeof val !== "string") return false;

    const arr = val.split(" ");
    if (arr[0] === "Bearer" && isJWT(arr[1])) {
      return true;
    }

    return false;
  }),
});
