import { Tree } from "@open-decision/type-classes";

export const updateInputType =
  <
    TInputTypes extends readonly string[],
    TTree extends Tree.TTree = Tree.TTree
  >(
    tree: TTree
  ) =>
  (inputId: string, newType: TInputTypes[number]) => {
    const input = tree.inputs?.[inputId];
    if (!input) return;
    input.type = newType;
  };
