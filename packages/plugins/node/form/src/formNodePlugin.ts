import {
  addInput,
  NodePlugin,
  createFn,
} from "@open-decision/plugins-node-helpers";
import { RichText } from "@open-decision/rich-text-editor";
import {
  EntityPluginType,
  NodePlugin,
  NodePluginBaseType,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";
import {
  createVariableFromInput,
  formNodeInputPlugins,
  IFormNodeInput,
} from "./createInputPlugins";
import { ODProgrammerError } from "@open-decision/type-classes";
import { fromPairs } from "remeda";
import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";

const DirectEdge = new DirectEdgePlugin();

export const typeName = "form" as const;

const DataType = z.object({
  content: RichText.optional(),
  inputs: z.array(z.string()),
});

export const FormNodePluginType = NodePluginBaseType(typeName, DataType);

export type TFormNodePlugin = EntityPluginType<typeof FormNodePluginType>;

export class FormNodePlugin extends NodePlugin<TFormNodePlugin> {
  inputPlugins = formNodeInputPlugins;

  constructor() {
    super(typeName, FormNodePluginType, { inputs: [] });
  }

  create: createFn<typeof this.Type> =
    ({ data, ...rest }) =>
    (treeClient) => {
      const newNode = treeClient.nodes.create.node({
        type: this.typeName,
        data: { ...this.defaultData, ...data },
        ...rest,
      });

      return this.Type.parse(newNode);
    };

  updateNodeContent =
    (nodeId: string, content: TFormNodePlugin["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.content = content;
    };

  reorderInputs =
    (nodeId: string, newInputs: string[]) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.inputs = newInputs;
    };

  connectInputAndNode =
    (nodeId: string, inputId: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      // We get the input just to validate that it exists.
      treeClient.pluginEntity.get.single("inputs", inputId);

      node.data.inputs.push(inputId);
    };

  disconnectInputAndNode =
    (nodeId: string, inputId: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      const inputIndex = node.data.inputs?.findIndex((id) => id === inputId);

      if (!(inputIndex !== null)) return;

      node.data.inputs?.splice(inputIndex, 1);
    };

  updateTarget =
    ({
      nodeId,
      newItem,
      edgeId,
    }: {
      nodeId: string;
      newItem: string;
      edgeId?: string;
    }) =>
    (treeClient: TTreeClient) => {
      const edge = edgeId ? treeClient.edges.get.single(edgeId) : undefined;

      if (!edge) return;

      if (!edge?.target && newItem) {
        const newEdge = DirectEdge.create({
          data: undefined,
          source: nodeId,
          target: newItem,
        })(treeClient);

        if (newEdge instanceof Error) return;

        treeClient.edges.add(newEdge);
      }

      if (edge?.target && newItem)
        treeClient.edges.connect.toTargetNode(edge.id, newItem);
    };

  get inputs() {
    return {
      getInputByNode: getInputByNode(this),
      getNodesByInput: getNodesByInput(this),
      add: addInput,
    };
  }

  createVariable =
    (answers: Record<string, string | string[] | undefined>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return fromPairs(
        Object.entries(answers).map(([key, answer]) => {
          const input = treeClient.pluginEntity.get.single<IFormNodeInput>(
            "inputs",
            key
          );

          if (input instanceof ODProgrammerError) {
            throw input;
          }

          const variable = createVariableFromInput(input, answer);

          if (!variable)
            throw new ODProgrammerError({
              code: "INVALID_INPUT_TYPE",
              message:
                "You have provided an input of a type that the form node does not support.",
            });

          return [variable.id, variable];
        })
      );
    };
}
