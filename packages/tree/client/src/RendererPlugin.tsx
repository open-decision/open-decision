import { useTree } from "@open-decision/tree-sync";
import { getInputs } from "@open-decision/tree-type";
import { RendererComponent as SelectRendererComponent } from "@open-decision/input-plugins-select";
import { RendererComponent as FreeTextRendererComponent } from "@open-decision/input-plugins-free-text";
import { StyleObject } from "@open-decision/design-system";
import { z } from "zod";
import { TTreeClient } from "./createTreeClient";

type RendererPluginProps = { inputIds: string[]; css: StyleObject };

export function RendererPlugin({ inputIds, css }: RendererPluginProps) {
  const inputs = useTree((tree) =>
    getInputs(tree)(inputIds)
  ) as unknown as Record<string, z.infer<TTreeClient["inputs"]["Type"]>>;

  return (
    <>
      {Object.values(inputs ?? {}).map((input) => {
        switch (input.type) {
          case "select":
            return <SelectRendererComponent css={css} input={input} />;

          case "freeText":
            return <FreeTextRendererComponent css={css} input={input} />;

          default:
            return null;
        }
      })}
    </>
  );
}
