// import { pathOr, pipe, map } from "remeda";
// import { allTreeData, treeObject } from "types/global";

// export const getAllTreeData: allTreeData = (data) => {
//   const parseTags = (data: treeObject) =>
//     pipe(data, pathOr(["node", "tags"], ""), JSON.parse);

//   return pipe(data, pathOr(["allDecisionTrees", "edges"], []), map(parseTags));
// };
