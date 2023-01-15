import {
  addInput,
  getInputByNode,
  getNodesByInput,
} from "@open-decision/plugins-node-helpers";
import { RichText } from "@open-decision/rich-text-editor";
import {
  EntityPluginType,
  NodePluginBaseType,
  NodePluginWithVariable,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";
import { ODProgrammerError } from "@open-decision/type-classes";
import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import {
  createVariableFromInput,
  FormNodeVariableType,
  TFormNodeVariable,
} from "./FormNodeVariable";
import { formNodeInputPlugins, TFormNodeInput } from "./FormNodeInputs";

const DirectEdge = new DirectEdgePlugin();

export const typeName = "form" as const;

const DataType = z.object({
  content: RichText.optional(),
  inputs: z.array(z.string()),
});

export const FormNodePluginType = NodePluginBaseType(typeName, DataType);

export type TFormNode = EntityPluginType<typeof FormNodePluginType>;

export class FormNodePlugin extends NodePluginWithVariable<
  TFormNode,
  typeof FormNodeVariableType
> {
  inputPlugins = formNodeInputPlugins;

  constructor() {
    super(typeName, FormNodePluginType, { inputs: [] });
  }

  VariableType = FormNodeVariableType;

  updateNodeContent =
    (nodeId: string, content: TFormNode["data"]["content"]) =>
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

      if (edge instanceof Error) return;

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
      getByNode: getInputByNode(this),
      add: addInput,
    };
  }

  getByInput = getNodesByInput(this);

  createVariable =
    (
      nodeId: string,
      answer: Record<string, string | string[] | undefined>,
      readable = false
    ) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node instanceof Error) return undefined;

      const variables: TFormNodeVariable = {};

      for (const key in answer) {
        const value = answer[key];

        const input = treeClient.pluginEntity.get.single<TFormNodeInput>(
          "inputs",
          key
        );

        if (input instanceof ODProgrammerError) continue;

        const variable = createVariableFromInput(node, input, value, readable);

        if (variable instanceof ODProgrammerError) continue;

        variables[variable[0]] = variable[1];
      }

      return [node.id, variables] as const;
    };
}
