import { Form } from "@open-decision/design-system";
import {
  RendererNodeActions,
  RendererNodeContent,
} from "@open-decision/node-editor";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { useTree } from "@open-decision/tree-sync";
import { getInputs } from "@open-decision/tree-type";
import { TQuestionNode } from "./plugin";

export const Content: RendererNodeContent<TQuestionNode> = ({ node }) => {
  if (!node.data.content) return null;

  return <RichTextRenderer content={node.data.content} key={node.id} />;
};

export const Actions: RendererNodeActions<TQuestionNode> = ({
  node,
  css,
  inputPlugins,
}) => {
  const inputs = useTree((tree) => getInputs(tree)(node.data.inputs));

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
};
