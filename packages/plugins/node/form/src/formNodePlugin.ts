import {
  addInput,
  updateInput,
  NodePlugin,
  createFn,
} from "@open-decision/plugins-node-helpers";
import { RichText } from "@open-decision/rich-text-editor";
import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import {
  createVariableFromInput,
  formNodeInputPlugins,
  formNodeInputType,
  FormNodeVariable,
} from "./createInputPlugins";
import { ODProgrammerError } from "@open-decision/type-classes";
import { fromPairs } from "remeda";

export const typeName = "form" as const;

export const DataType = z.object({
  content: RichText.optional(),
  inputs: z.array(z.string()),
});

export class FormNodePlugin extends NodePlugin<
  typeof DataType,
  typeof typeName
> {
  inputPlugins = formNodeInputPlugins;
  inputType = formNodeInputType;
  constructor() {
    super(DataType, typeName);
    this.defaultData = { inputs: [] };
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
    (nodeId: string, content: z.infer<typeof this.Type>["data"]["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.content = content;
    };

  reorderInputs =
    (nodeId: string, newInputs: string[]) => (treeClient: TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      node.data.inputs = newInputs;
    };

  connectInputAndNode =
    (nodeId: string, inputId: string) => (treeClient: TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

      if (node instanceof Error) throw node;

      // We get the input just to validate that it exists.
      treeClient.pluginEntity.get.single("inputs", inputId);

      node.data.inputs.push(inputId);
    };

  disconnectInputAndNode =
    (nodeId: string, inputId: string) => (treeClient: TTreeClient) => {
      const node = this.get.single(nodeId)(treeClient);

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

      if (edge instanceof Error) throw edge;

      if (!edge?.target && newItem) {
        const newEdge = treeClient.edges.create({
          source: nodeId,
          target: newItem,
        });

        if (newEdge instanceof Error) return;

        treeClient.edges.add(newEdge);
      }

      if (edge?.target && newItem)
        treeClient.edges.connect.toTargetNode(edge.id, newItem);
    };

  updateInput = updateInput;
  addInput = addInput;

  createVariable =
    (answers: Record<string, string | string[] | undefined>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return fromPairs(
        Object.entries(answers).map(([key, answer]) => {
          const input = treeClient.pluginEntity.get.single<
            typeof this.inputType
          >("inputs", key);

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

  getAnswer = (nodeId: string, answers: any) => {
    return answers[nodeId]?.answers as FormNodeVariable | undefined;
  };
}

export type TFormNode = z.infer<FormNodePlugin["Type"]>;
