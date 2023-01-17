import * as React from "react";
import {
  addNotification,
  Row,
  SubmitButton,
  VisuallyHidden,
} from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { useMutation } from "@tanstack/react-query";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { RendererPrimitives } from "@open-decision/renderer";
import { DocumentNodePlugin } from "./DocumentNodePlugin";
import { isODError, ODError } from "@open-decision/type-classes";
import { useTranslations } from "next-intl";
import { TNodeRenderer } from "@open-decision/plugins-node-helpers";
import { APIClient } from "@open-decision/api-client";

const DocumentNode = new DocumentNodePlugin();

export const DocumentNodeRenderer: TNodeRenderer = ({ nodeId, ...props }) => {
  const {
    treeClient,
    environment,
    state: {
      context: { variables },
    },
  } = useInterpreter();

  const node = DocumentNode.getSingle(nodeId)(treeClient);

  const t = useTranslations("common.errors");

  const ref = React.useRef<HTMLAnchorElement | null>(null);
  const { mutate, data, isLoading } = useMutation(
    ["generateDocument"],
    async () => {
      if (!node) return;

      if (!node.templateUuid) {
        throw new ODError({
          code: "MISSING_TEMPLATE_UUID",
          message: "Missing template uuid to generate document.",
        });
      }

      const readableAnswers = mapValues(answers, (answer) =>
        nodePlugins.pluginsWithVariable[answer.type].createVariable(
          nodeId,
          answer
        )(treeClient)
      );

      const response = await APIClient.trees[environment].generateDocument({
        params: { uuid: node.templateUuid },
        body: { variables: readableAnswers },
      });

      const blob = await response.blob();

      const file = new Blob([blob], { type: "application/xlsx" });

      return URL.createObjectURL(file);
    },
    {
      onSuccess: (data) => {
        if (!ref.current || !data) return;

        ref.current.href = data;
        return ref.current.click();
      },
      onError: (error) => {
        if (isODError(error)) {
          addNotification({
            title: t(`${error.code}.short`),
            content: t(`${error.code}.long`),
            variant: "danger",
          });
        }
      },
    }
  );

  if (!node) return null;

  return (
    <RendererPrimitives.Container
      nodeId={nodeId}
      successButtonLabel={node.rendererButtonLabel}
      {...props}
    >
      <RendererPrimitives.ContentArea>
        {node.content ? (
          <RichTextRenderer
            content={node.content}
            key={node.id}
            className="px-0"
          />
        ) : null}
      </RendererPrimitives.ContentArea>
      <Row className="justify-end">
        <SubmitButton
          type="button"
          onClick={() => mutate()}
          className="max-w-max"
          isLoading={isLoading}
        >
          Vertrag generieren
        </SubmitButton>
        <VisuallyHidden>
          <a href={data} download={`Vertrag.docx`} ref={ref}>
            Datei speichern
          </a>
        </VisuallyHidden>
      </Row>
    </RendererPrimitives.Container>
  );
};
