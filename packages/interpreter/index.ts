import { Node, Tree } from "@open-decision/type-classes";
import { isLeft } from "fp-ts/lib/Either";

export class Interpreter {
  tree: Tree.TTree;
  currentNode: string;
  history: { nodes: string[]; answers: Record<string, string> };
  state: "initialized" | "idle" | "error" | "interpreting";

  constructor(json) {
    const decodedJSON = Tree.Type.decode(json);

    if (isLeft(decodedJSON))
      throw new Error(`The provided tree is not in the correct format`);
    /**
     * Represents the entire decision tree.
     */
    this.tree = decodedJSON.right;
    /**
     * The state of the currently active node for this instance of the interpretation.
     */
    this.currentNode = this.tree.startNode;
    /**
     * The log of visited nodes and given answers.
     */
    this.history = { nodes: [], answers: {} };
    /**
     * Represents the current state of the interpretation.
     */
    this.state = "initialized";
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
  evaluateUserInput(answer: string) {
    this.state = "interpreting";

    this.history["nodes"].push(this.currentNode);
    this.history["answers"][this.currentNode] = answer;

    const nextNode = Node.getNextNodeId(this.tree[this.currentNode], answer);

    if (nextNode instanceof Error) {
      this.state = "error";
      return nextNode;
    } else {
      this.currentNode = nextNode;
      this.state = "idle";
      return this.getCurrentNode();
    }
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
    } else {
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
      treeChecksum: this.tree.checksum,
      history: this.history,
      currentNode: this.currentNode,
    };
  }

  //Load the JSON file storing the progress
  setInterpretationState(
    savedState: ReturnType<Interpreter["getInterpretationState"]>
  ) {
    if (savedState.treeChecksum === this.tree.checksum) {
      this.currentNode = savedState.currentNode;
      this.history = savedState.history;
      return this.getCurrentNode();
    } else {
      this.state = "error";
      return new Error(
        `The provided savedStates checksum is not equal to this trees checksum.`
      );
    }
  }
}
