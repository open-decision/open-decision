import {
  BuilderNode,
  BuilderRelation,
  BuilderTree,
} from "@open-decision/type-classes";

class Interpreter {
  history: { nodes: string[]; answers: Record<string, string> };
  state: "initialized" | "idle" | "error" | "interpreting";
  currentNode: string;
  hasHistory: boolean;

  constructor() {
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
  }
}

export class BuilderInterpreter extends Interpreter {
  tree: BuilderTree.TTree;

  constructor(json) {
    const decodedJSON = BuilderTree.Type.safeParse(json);

    if (!decodedJSON.success)
      throw new Error(`The provided tree is not in the correct format`);

    super();

    this.tree = decodedJSON.data;
    this.currentNode = this.tree.startNode;
  }

  /**
   * Used to receive the necessary data to render the `currentNode`.
   * @returns JSON String of the `currentNodes` `renderData`
   */
  getCurrentNode() {
    return this.tree.nodes[this.currentNode];
  }

  /**
   * Interprets the answer received from the user to determine the next node.
   */
  evaluateUserInput(relation: BuilderRelation.TRelation) {
    this.state = "interpreting";

    this._addToHistory(relation.answer ?? "");
    this.currentNode = relation.target ?? "";

    return this.getCurrentNode();
  }

  //Helper functions
  get treeName() {
    return this.tree.treeName;
  }

  /**
   * Allows to revert the last selection.
   */
  goBack() {
    const previousNode = this.history.nodes.pop();

    if (previousNode) {
      delete this.history.answers[this.currentNode];
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
    this.currentNode = this.tree.startNode;
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
    savedState: ReturnType<BuilderInterpreter["getInterpretationState"]>
  ) {
    this.currentNode = savedState.currentNode;
    this.history = savedState.history;
    return this.getCurrentNode();
  }

  _addToHistory(answer: string) {
    this.history["nodes"].push(this.currentNode);
    this.history["answers"][this.currentNode] = answer;
    this.hasHistory = this.history.nodes.length > 0;
  }
}
