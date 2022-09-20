import { useTree } from "@open-decision/tree-sync";
import { getInputs } from "@open-decision/tree-type";
import { RendererComponent as SelectRendererComponent } from "@open-decision/input-plugins-select";
import { RendererComponent as FreeTextRendererComponent } from "@open-decision/input-plugins-free-text";
import { Form, StyleObject } from "@open-decision/design-system";
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
            return (
              <SelectRendererComponent key={input.id} css={css} input={input}>
                <Form.Submit
                  css={{
                    alignSelf: "end",
                    marginTop: "$2",
                    fontWeight: "$large-text",
                  }}
                >
                  Weiter
                </Form.Submit>
              </SelectRendererComponent>
            );

          case "freeText":
            return (
              <FreeTextRendererComponent key={input.id} css={css} input={input}>
                <Form.Submit
                  css={{
                    alignSelf: "end",
                    marginTop: "$2",
                    fontWeight: "$large-text",
                  }}
                >
                  Weiter
                </Form.Submit>
              </FreeTextRendererComponent>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
