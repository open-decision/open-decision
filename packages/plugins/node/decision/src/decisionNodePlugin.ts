import {
  deleteEntityFn,
  TReadOnlyTreeClient,
  TTreeClient,
  INodePlugin,
  NodePluginWithVariable,
} from "@open-decision/tree-type";
import {
  DecisionNodeInputPlugins,
  TDecisionNodeInputs,
} from "./createInputPlugins";
import { ODProgrammerError } from "@open-decision/type-classes";
import {
  addInput,
  getInputByNode,
  getNodesByInput,
} from "@open-decision/plugins-node-helpers";
import {
  ISelectVariable,
  SelectVariablePlugin,
} from "@open-decision/plugins-variable-select";
import { match } from "ts-pattern";
import { TRichText } from "@open-decision/rich-text-editor";

const SelectVariable = new SelectVariablePlugin();

export type TDecisionNodeVariable = ISelectVariable;

export const typeName = "decision" as const;

export interface IDecisionNode extends INodePlugin<typeof typeName> {
  content?: TRichText;
  input?: string;
}

export class DecisionNodePlugin extends NodePluginWithVariable<
  IDecisionNode,
  TDecisionNodeVariable
> {
  inputPlugins = DecisionNodeInputPlugins;

  constructor() {
    super(typeName);
  }

  create =
    ({
      position = { x: 0, y: 0 },
      ...data
    }: Omit<IDecisionNode, "id" | "type">) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: crypto.randomUUID(),
        type: this.type,
        position,
        ...data,
      } satisfies IDecisionNode;
    };

  inputs = {
    getByNode: getInputByNode<IDecisionNode, TDecisionNodeInputs>(this),
    add: addInput,
  };

  getByInput = getNodesByInput(this);

  connectInputAndNode =
    (nodeId: string, inputId: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      // We get the input just to validate that it exists.
      treeClient.pluginEntity.get.single("inputs", inputId);

      node.input = inputId;
    };

  disconnectInputAndNode = (nodeId: string) => (treeClient: TTreeClient) => {
    const node = this.getSingle(nodeId)(treeClient);

    if (node instanceof Error) throw node;

    delete node.input;
  };

  updateInput =
    (nodeId: string, newInputId: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) return;

      node.input = newInputId;
    };

  updateNodeContent =
    (nodeId: string, content: IDecisionNode["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.content = content;
    };

  override delete: deleteEntityFn =
    (ids: string[]) => (treeClient: TTreeClient) => {
      const nodes = this.getCollection(ids)(treeClient);

      if (!nodes) return;

      treeClient.nodes.delete(ids);

      for (const id in nodes) {
        const value = nodes[id];

        const edges = treeClient.edges.get.byNode(id);
        treeClient.edges.delete(
          [
            ...Object.values(edges?.source ?? {}),
            ...Object.values(edges?.target ?? {}),
          ]
            .filter((edge) => edge.source === id || edge.target === id)
            .map((edge) => edge.id)
        );

        if (value.input) {
          DecisionNodeInputPlugins.select.plugin.delete([value.input])(
            treeClient
          );
        }
      }
    };

  getVariable = (nodeId: string, answers: any) => {
    return answers[nodeId] as TDecisionNodeVariable;
  };

  private getVariableData =
    (nodeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) return node;
      if (!node.input)
        return new ODProgrammerError({ code: "NODE_WITHOUT_INPUT" });

      const input = treeClient.pluginEntity.get.single<TDecisionNodeInputs>(
        "inputs",
        node.input
      );

      if (input instanceof ODProgrammerError) return input;

      return { node, input };
    };

  createVariable =
    (nodeId: string, answer: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const data = this.getVariableData(nodeId)(treeClient);

      if (data instanceof Error) return data;

      return match(data.input)
        .with({ type: "select" }, (input) =>
          SelectVariable.create({
            id: data.node.id,
            value: answer,
            values: input.answers,
          })
        )
        .run();
    };

  createReadableVariable =
    (nodeId: string, answer: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const data = this.getVariableData(nodeId)(treeClient);

      if (data instanceof Error) return data;

      return match(data.input)
        .with({ type: "select" }, (input) => {
          const value = input.answers.find(
            (inputAnswer) => answer === inputAnswer.id
          )?.value;

          if (!value)
            return new ODProgrammerError({
              code: "REQUESTED_ANSWER_DOES_NOT_EXIST_ON_INPUT",
            });

          if (!data.node.name)
            return new ODProgrammerError({ code: "MISSING_NAME" });

          return SelectVariable.create({
            id: this.createReadableKey(data.node.name),
            value: answer,
            values: input.answers,
          });
        })
        .run();
    };
}
