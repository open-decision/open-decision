import { Tree } from "../type-classes";
import { deleteEdges } from "./deleteEdges";

export const deleteConditions = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    delete tree.conditions?.[id];

    deleteEdges(tree)(
      Object.values(tree.edges ?? {})
        .filter((edge) => edge.conditionId === id)
        .map((edge) => edge.id)
    );
  });
};
