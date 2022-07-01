import { Tree } from "../type-classes";

export class TreeClient<TNode, TCondition, TInput> {
  private declare tree: Tree.TTree;

  constructor(tree: Tree.TTree) {
    this.tree = tree;
  }
}
