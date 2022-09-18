import { useInputs } from "@open-decision/tree-sync";
import { z } from "zod";
import { TTreeClient } from "./createTreeClient";
import { RendererComponent as SelectRendererComponent } from "@open-decision/input-plugins-select";
import { RendererComponent as FreeTextRendererComponent } from "@open-decision/input-plugins-free-text";
import { StyleObject } from "@open-decision/design-system";

type RendererPluginProps = { inputIds: string[]; css: StyleObject };

export function RendererPlugin({ inputIds, css }: RendererPluginProps) {
  const inputs = useInputs(inputIds) as unknown as Record<
    string,
    z.infer<TTreeClient["inputs"]["Type"]>
  >;

  return (
    <>
      {Object.values(inputs).map((input) => {
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
