import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";

export const updateInputLabel =
  <TType extends z.ZodObject<{ label: z.ZodOptional<z.ZodString> }>>(
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
