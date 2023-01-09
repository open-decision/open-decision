import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";

export const updateInputLabel =
  <
    TPluginType extends z.ZodObject<{ label: z.ZodOptional<z.ZodString> }>,
    TType extends TPluginType | z.ZodDiscriminatedUnion<string, TPluginType[]>
  >(
    Type: TType
  ) =>
  (inputId: string, newLabel: string) =>
  (treeClient: TTreeClient) => {
    const input = treeClient.pluginEntity.get.single<typeof Type>(
      "inputs",
      inputId
    );

    if (!input) return;

    input.label = newLabel;
  };
