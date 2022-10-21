import { Form, StyleObject } from "@open-decision/design-system";
import { Input, InputPluginObject } from "@open-decision/input-plugins-helpers";
import { useTree } from "@open-decision/tree-sync";

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
  const inputs = useTree((treeClient) => {
    return treeClient.pluginEntity.get.collection(
      "inputs",
      inputIds,
      Input.Type
    );
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
