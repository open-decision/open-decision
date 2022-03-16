import {
  BuilderNode,
  BuilderRelation,
  BuilderTree,
} from "@open-decision/type-classes";

export class Interpreter {
  history: { nodes: string[]; answers: Record<string, string> };
  state: "initialized" | "idle" | "error" | "interpreting";
  currentNode: string;
  hasHistory: boolean;
  tree: BuilderTree.TTree;

  constructor(json: BuilderTree.TTree) {
    /**
     * The log of visited nodes and given answers.
     */
    this.history = { nodes: [], answers: {} };
    /**
     * Represents the current state of the interpretation.
     */
    this.state = "initialized";
    this.currentNode = "";
    this.hasHistory = this.history.nodes.length > 0;

    const decodedJSON = BuilderTree.Type.safeParse(json);

    if (!decodedJSON.success) {
      throw new Error(
        `The provided tree is not in the correct format: ${decodedJSON.error}`
      );
    }

    console.log(decodedJSON.data);

    this.tree = decodedJSON.data;
    this.currentNode = this.tree.treeData.startNode ?? "";
  }

  updateTree(json: any) {
    const decodedJSON = BuilderTree.Type.safeParse(json);

    if (!decodedJSON.success)
      throw new Error(`The provided tree is not in the correct format`);

    this.tree = decodedJSON.data;
    this.currentNode = this.tree.treeData.startNode ?? "";
  }

  /**
   * Used to receive the necessary data to render the `currentNode`.
   * @returns JSON String of the `currentNodes` `renderData`
   */
  getCurrentNode() {
    return this.tree.treeData.nodes[this.currentNode];
  }

  /**
   * Interprets the answer received from the user to determine the next node.
   */
  evaluateUserInput(relation: BuilderRelation.TRelation) {
    this.state = "interpreting";

    if (!relation.target) {
      this.state = "error";
      return new Error(`The relation provided does not have a target.`);
    }

    this._addToHistory(relation.id);
    this.currentNode = relation.target;

    return this.getCurrentNode();
  }

  //Helper functions
  get treeName() {
    return this.tree.name;
  }

  /**
   * Allows to revert the last selection.
   */
  goBack() {
    const previousNode = this.history.nodes.pop();

    if (previousNode) {
      this.currentNode = previousNode;
      this.hasHistory = this.history.nodes.length > 0;
    } else {
      this.hasHistory = this.history.nodes.length > 0;
      return this.reset();
    }

    return this.getCurrentNode();
  }

  /**
   * Restart the Interpretation.
   */
  reset() {
    this.currentNode = this.tree.treeData.startNode ?? "";
    this.history = { nodes: [], answers: {} };
    return this.getCurrentNode();
  }

  getInterpretationState() {
    // Save log and current node
    return {
      history: this.history,
      currentNode: this.currentNode,
    };
  }

  //Load the JSON file storing the progress
  setInterpretationState(
    savedState: ReturnType<Interpreter["getInterpretationState"]>
  ) {
    this.currentNode = savedState.currentNode;
    this.history = savedState.history;
    return this.getCurrentNode();
  }

  getNode(nodeId: string): BuilderNode.TNode | undefined {
    return this.tree.treeData.nodes[nodeId];
  }

  getRelationById(nodeId: string, relationId: string) {
    const relation = this.getNode(nodeId)?.relations[relationId];

    if (!relation) return undefined;

    return relation;
  }

  getAnswer(nodeId: string) {
    const maybeAnswer = this.history.answers[nodeId];
    const relation = this.getRelationById(nodeId, maybeAnswer);

    if (!relation) return undefined;

    return relation;
  }

  _addToHistory(answerId: string) {
    this.history["nodes"].push(this.currentNode);
    this.history["answers"][this.currentNode] = answerId;
    this.hasHistory = this.history.nodes.length > 0;
  }
}
