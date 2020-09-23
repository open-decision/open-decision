// import { map, pathOr, pipe } from "remeda";
// import { Tree } from "types/global";

// export const getSingleTreeData = (data: Tree): Tree[] => {
//   const parseInputs = pipe((x: Tree) => x?.inputs ?? "", JSON.parse);

//   return pipe(
//     data,
//     pathOr(["decisionTree", "nodeSet", "edges"], []),
//     map(parseInputs)
//   );
// };

//TODO needs to be rewritten, because the data coming from the database has changed due to flume
