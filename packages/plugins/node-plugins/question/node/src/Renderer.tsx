import { Form } from "@open-decision/design-system";
import {
  RendererNodeActions,
  RendererNodeContent,
} from "@open-decision/node-editor";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { useTree } from "@open-decision/tree-sync";
import { getInputs, Input } from "@open-decision/input-plugins-helpers";
import { TQuestionNode } from "./plugin";
import { createTreeClient } from "@open-decision/tree-type";

export const Content: RendererNodeContent<TQuestionNode> = ({ node }) => {
  if (!node.data.content) return null;

  return <RichTextRenderer content={node.data.content} key={node.id} />;
};

export const Actions: RendererNodeActions<TQuestionNode> = ({
  node,
  css,
  inputPlugins,
}) => {
  const inputs = useTree((treeClient) => {
    return treeClient.pluginEntity.get.collection(
      "inputs",
      node.data.inputs,
      Input.Type
    );
  });

  return (
    <>
      {Object.values(inputs ?? {}).map((input) => {
        const Input = inputPlugins[input.type];

        return (
          <Input.RendererComponent input={input} css={css} key={input.id}>
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
};
