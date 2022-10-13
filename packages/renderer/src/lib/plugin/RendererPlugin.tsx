import { Form, StyleObject } from "@open-decision/design-system";
import {
  getInputs,
  Input,
  InputPluginObject,
} from "@open-decision/input-plugins-helpers";
import { useTree } from "@open-decision/tree-sync";
import { createTreeClient } from "@open-decision/tree-type";

type RendererPluginProps = {
  inputIds: string[];
  css: StyleObject;
  inputPlugins: Record<string, InputPluginObject<any, any, any>>;
};

export function RendererPlugin({
  inputIds,
  css,
  inputPlugins,
}: RendererPluginProps) {
  const inputs = useTree((tree) => {
    const treeClient = createTreeClient(tree);
    return getInputs(treeClient, Input.Type)(inputIds);
  });

  return (
    <>
      {Object.values(inputs ?? {}).map((input) => {
        const Input = inputPlugins[input.type];

        return (
          <Input.RendererComponent input={input} css={css}>
            <Form.Submit
              css={{
                alignSelf: "end",
                marginTop: "$2",
                fontWeight: "$large-text",
              }}
            >
              Weiter
            </Form.Submit>
          </Input.RendererComponent>
        );
      })}
    </>
  );
}
