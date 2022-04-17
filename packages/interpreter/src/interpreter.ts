import { Tree } from "@open-decision/type-classes";

export class Interpreter {
  history: { nodes: string[]; answers: Record<string, string> };
  state: "initialized" | "idle" | "error" | "interpreting";
  currentNode: string;
  hasHistory: boolean;
  tree: Tree.TTree;

  constructor(json: Tree.TTree) {
    /**
     * The log of visited inputs and given answers.
     */
    this.history = { nodes: [], answers: {} };
    /**
     * Represents the current state of the interpretation.
     */
    this.state = "initialized";
    this.currentNode = "";
    this.hasHistory = this.history.nodes.length > 0;

    const decodedJSON = Tree.Type.safeParse(json);

    if (!decodedJSON.success) {
      throw new Error(
        `The provided tree is not in the correct format: ${decodedJSON.error}`
      );
    }

    this.tree = decodedJSON.data;
    this.currentNode = this.tree.startNode ?? "";
  }

  updateTree(json: any) {
    const decodedJSON = Tree.Type.safeParse(json);

    if (!decodedJSON.success)
      throw new Error(`The provided tree is not in the correct format`);

    this.tree = decodedJSON.data;
    this.currentNode = this.tree.startNode ?? "";
  }

  /**
   * Used to receive the necessary data to render the `currentNode`.
   * @returns JSON String of the `currentNodes` `renderData`
   */
  getCurrentNode() {
    return this.tree.nodes?.[this.currentNode];
  }

  addUserAnswer(inputId: string, answerId: string) {
    const currentNode = this.getCurrentNode();

    if (!currentNode?.data.inputs.includes(inputId))
      return new Error(
        `The input of id ${inputId} is not part of the currentNode`
      );

    const input = Tree.getInput(this.tree)(inputId);
    const answer = input?.answers.find((answer) => answer.id === answerId);

    if (!input || !answer)
      return new Error(`The provided answer could not be found on the input`);

    this._addToHistory(input.id, answer.id);
  }

  evaluateNodeConditions(conditionIds: string[]) {
    this.state = "interpreting";
    const conditions = Tree.getConditions(this.tree)(conditionIds);

    if (!conditions) {
      this.state = "error";
      return new Error(`The node does not have any conditions associated.`);
    }

    for (const conditionId in conditions) {
      const condition = conditions[conditionId];
      const existingAnswerId = this.getAnswer(condition.inputId);

      if (condition.answerId === existingAnswerId) {
        const edge = Object.values(this.tree.edges ?? {}).find(
          (edge) => edge.conditionId === conditionId
        );

        if (!edge) return new Error("There is no Edge for this condition.");

        this.currentNode = edge.target;
      }
    }

    return this.getCurrentNode();
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
    this.currentNode = this.tree.startNode ?? "";
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

  getAnswer(inputId: string) {
    const maybeAnswer = this.history.answers[inputId];

    if (!maybeAnswer) return undefined;

    return maybeAnswer;
  }

  _addToHistory(inputId: string, answerId: string) {
    this.history.nodes.push(this.currentNode);
    this.history.answers[inputId] = answerId;

    this.hasHistory = this.history.nodes.length > 0;
  }
}
