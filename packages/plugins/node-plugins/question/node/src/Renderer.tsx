import { Form } from "@open-decision/design-system";
import {
  RendererNodeActions,
  RendererNodeContent,
} from "@open-decision/node-editor";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { QuestionNodePlugin, TQuestionNode } from "./plugin";
import { Input } from "@open-decision/form-element-helpers";
import { match } from "ts-pattern";

export const Content: RendererNodeContent<TQuestionNode> = ({ node }) => {
  if (!node.data.content) return null;

  return <RichTextRenderer content={node.data.content} key={node.id} />;
};

export const Actions: RendererNodeActions<TQuestionNode> = ({
  node,
  css,
  children,
}) => {
  const treeClient = useTreeClient();
  const QuestionNode = new QuestionNodePlugin(treeClient);
  const inputs = useTree((treeClient) => {
    return treeClient.pluginEntity.get.collection(
      "inputs",
      node.data.inputs,
      QuestionNode.inputType
    );
  });

  return (
    <>
      {Object.values(inputs ?? {}).map((input) => {
        return match(input)
          .with({ type: "text" }, (input) => {
            const FormElement =
              QuestionNode.inputPlugins.text.RendererComponent;

            return (
              <FormElement input={input} css={css} key={input.id}>
                {children}
              </FormElement>
            );
          })
          .with({ type: "select" }, (input) => {
            const FormElement =
              QuestionNode.inputPlugins.select.RendererComponent;

            return (
              <FormElement input={input} css={css} key={input.id}>
                {children}
              </FormElement>
            );
          });
      })}
    </>
  );
};
